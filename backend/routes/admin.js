const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET =
  process.env.JWT_SECRET || 'milevia_jwt_secret_change_in_production';

// ── Middleware: verify admin JWT ──────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
}

// ── POST /api/admin/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Username and password required.' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials.' });
    }

    const admin = rows[0];

    // Support both bcrypt hashes and plain-text password for initial setup.
    // If the stored hash doesn't look like bcrypt, compare directly and upgrade.
    let match = false;
    if (admin.password_hash.startsWith('$2')) {
      match = await bcrypt.compare(password, admin.password_hash);
    } else {
      match = password === admin.password_hash;
      // Upgrade plain-text to bcrypt on first successful login
      if (match) {
        const newHash = await bcrypt.hash(password, 10);
        await pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [
          newHash,
          admin.id,
        ]);
      }
    }

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/admin/apartments ─────────────────────────────────
router.get('/apartments', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, l.name as location_name
       FROM apartments a
       LEFT JOIN locations l ON a.location_id = l.id
       ORDER BY a.created_at DESC`
    );
    const apartments = rows.map((apt) => ({
      ...apt,
      amenities:
        typeof apt.amenities === 'string'
          ? JSON.parse(apt.amenities)
          : apt.amenities,
      images:
        typeof apt.images === 'string' ? JSON.parse(apt.images) : apt.images,
    }));
    res.json({ success: true, data: apartments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/admin/partners ────────────────────────────────────
router.get('/partners', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query =
      'SELECT id, full_name, email, phone, company, experience, message, status, approved_at, created_at FROM partners';
    const params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, params);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PATCH /api/admin/partners/:id ────────────────────────────
router.patch('/partners/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status value.' });
    }
    const approved_at = status === 'approved' ? new Date() : null;
    await pool.execute(
      'UPDATE partners SET status = ?, approved_at = ? WHERE id = ?',
      [status, approved_at, req.params.id]
    );
    res.json({ success: true, message: `Partner ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/admin/sales ──────────────────────────────────────
router.get('/sales', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sales ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/admin/sales ─────────────────────────────────────
router.post('/sales', requireAdmin, async (req, res) => {
  try {
    const {
      place,
      property_type,
      listing_status,
      price_etb,
      area_sqm,
      bedrooms,
      bathrooms,
      floor,
      total_floors,
      agent_name,
      sold_date,
      notes,
    } = req.body;
    if (!place || !property_type || !price_etb || !area_sqm) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Place, type, price and area are required.',
        });
    }
    const [result] = await pool.execute(
      `INSERT INTO sales (place, property_type, listing_status, price_etb, area_sqm,
        bedrooms, bathrooms, floor, total_floors, agent_name, sold_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        place,
        property_type,
        listing_status || 'active',
        price_etb,
        area_sqm,
        bedrooms || null,
        bathrooms || null,
        floor || null,
        total_floors || null,
        agent_name || null,
        sold_date || null,
        notes || null,
      ]
    );
    res
      .status(201)
      .json({ success: true, message: 'Property added.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /api/admin/sales/:id ───────────────────────────────
router.delete('/sales/:id', requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM sales WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Property deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/admin/admins (list admins) ─────────────────────
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, created_at FROM admins ORDER BY id'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
module.exports.requireAdmin = requireAdmin;
