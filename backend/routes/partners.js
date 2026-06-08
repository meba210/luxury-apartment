const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'milevia_secret_2024';

// ── Middleware: verify partner JWT ────────────────────────────
function requirePartner(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'partner') {
      return res.status(403).json({ success: false, message: 'Partner access required' });
    }
    req.partner = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// ── POST /api/partners/register ───────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, phone, company, experience, message, password } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, phone and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check duplicate email
    const [existing] = await pool.execute('SELECT id FROM partners WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO partners (full_name, email, phone, company, experience, message, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, company || null, experience || null, message || null, hash]
    );

    res.status(201).json({
      success: true,
      message: 'Registration submitted! Your application is under review. We will notify you by email once approved.',
      id: result.insertId
    });
  } catch (err) {
    console.error('Partner register error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /api/partners/login ──────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await pool.execute('SELECT * FROM partners WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const partner = rows[0];
    const match = await bcrypt.compare(password, partner.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (partner.status === 'pending') {
      return res.status(403).json({ success: false, message: 'Your application is still under review. Please wait for admin approval.' });
    }
    if (partner.status === 'rejected') {
      return res.status(403).json({ success: false, message: 'Your application was not approved. Please contact us for more information.' });
    }

    const token = jwt.sign(
      { id: partner.id, email: partner.email, name: partner.full_name, role: 'partner' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      partner: {
        id: partner.id,
        full_name: partner.full_name,
        email: partner.email,
        phone: partner.phone,
        company: partner.company,
        status: partner.status,
        approved_at: partner.approved_at
      }
    });
  } catch (err) {
    console.error('Partner login error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/partners/sales  (approved partners only) ─────────
router.get('/sales', requirePartner, async (req, res) => {
  try {
    const { search, status, type, sort = 'created_at', order = 'desc' } = req.query;

    const allowed = ['created_at', 'price_etb', 'area_sqm', 'per_sqm_birr', 'place'];
    const sortCol = allowed.includes(sort) ? sort : 'created_at';
    const sortDir = order === 'asc' ? 'ASC' : 'DESC';

    let query = 'SELECT * FROM sales WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (place LIKE ? OR agent_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      query += ' AND listing_status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND property_type = ?';
      params.push(type);
    }

    query += ` ORDER BY ${sortCol} ${sortDir}`;

    const [rows] = await pool.execute(query, params);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('Sales fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/partners/me  (profile) ──────────────────────────
router.get('/me', requirePartner, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, phone, company, experience, status, approved_at, created_at FROM partners WHERE id = ?',
      [req.partner.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
module.exports.requirePartner = requirePartner;
