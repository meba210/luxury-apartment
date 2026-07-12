const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'milevia_secret_2024';

async function hasColumn(tableName, columnName) {
  try {
    const [rows] = await pool.execute(
      'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      [tableName, columnName]
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

async function ensurePartnerColumns() {
  const columns = [
    { name: 'additional_phone', type: 'VARCHAR(50)' },
    { name: 'telegram_username', type: 'VARCHAR(100)' },
    { name: 'address', type: 'VARCHAR(255)' },
    { name: 'id_number', type: 'VARCHAR(100)' },
    { name: 'dob', type: 'DATE' },
    { name: 'education_level', type: 'VARCHAR(100)' },
    { name: 'institution', type: 'VARCHAR(200)' },
    { name: 'field_of_study', type: 'VARCHAR(200)' },
    { name: 'company', type: 'VARCHAR(200)' },
    { name: 'experience', type: 'TEXT' },
    { name: 'message', type: 'TEXT' },
    { name: 'passion', type: 'TEXT' },
    { name: 'about', type: 'TEXT' },
  ];

  for (const col of columns) {
    const exists = await hasColumn('partners', col.name);
    if (!exists) {
      await pool.execute(
        `ALTER TABLE partners ADD COLUMN ${col.name} ${col.type}`
      );
    }
  }
}

// ── Middleware: verify partner JWT ────────────────────────────
function requirePartner(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'partner') {
      return res
        .status(403)
        .json({ success: false, message: 'Partner access required' });
    }
    req.partner = decoded;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
}

// ── POST /api/partners/register ───────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      additional_phone,
      telegram_username,
      address,
      id_number,
      dob,
      education_level,
      institution,
      field_of_study,
      company,
      experience,
      message,
      passion,
      about,

      password,
    } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone and password are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check duplicate email
    const [existing] = await pool.execute(
      'SELECT id FROM partners WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    await ensurePartnerColumns();

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO partners (
         full_name, email, phone, additional_phone, telegram_username, address, id_number,
         dob, education_level, institution, field_of_study, company, 
         experience,message, passion,  about,  password_hash
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        additional_phone || null,
        telegram_username || null,
        address || null,
        id_number || null,
        dob || null,
        education_level || null,
        institution || null,
        field_of_study || null,
        company || null,

        experience || null,
        message  || null,
        passion || null,

        about || null,

        hash,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        'Registration submitted! Your application is under review. We will notify you by email once approved.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Partner register error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /api/partners/login ──────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM partners WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    const partner = rows[0];
    const match = await bcrypt.compare(password, partner.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    if (partner.status === 'pending') {
      return res.status(403).json({
        success: false,
        message:
          'Your application is still under review. Please wait for admin approval.',
      });
    }
    if (partner.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message:
          'Your application was not approved. Please contact us for more information.',
      });
    }

    const token = jwt.sign(
      {
        id: partner.id,
        email: partner.email,
        name: partner.full_name,
        role: 'partner',
      },
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
        approved_at: partner.approved_at,
      },
    });
  } catch (err) {
    console.error('Partner login error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/partners/sales  (approved partners only) ─────────
router.get('/sales', requirePartner, async (req, res) => {
  try {
    const {
      search,
      status,
      type,
      sort = 'created_at',
      order = 'desc',
    } = req.query;

    const allowed = [
      'created_at',
      'price_etb',
      'area_sqm',
      'per_sqm_birr',
      'place',
    ];
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
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/partners/me  (full profile) ─────────────────────
router.get('/me', requirePartner, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, additional_phone, telegram_username,
              address, id_number, dob, education_level, institution,
              field_of_study, company, experience, message, passion, about,
              status, approved_at, created_at
       FROM partners WHERE id = ?`,
      [req.partner.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /api/partners/me  (update profile info) ───────────────
router.put('/me', requirePartner, async (req, res) => {
  try {
    const {
      full_name, phone, additional_phone, telegram_username,
      address, company, about,
    } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({ success: false, message: 'Full name and phone are required.' });
    }

    await ensurePartnerColumns();

    await pool.execute(
      `UPDATE partners
       SET full_name = ?, phone = ?, additional_phone = ?,
           telegram_username = ?, address = ?, company = ?, about = ?
       WHERE id = ?`,
      [
        full_name.trim(),
        phone.trim(),
        additional_phone?.trim() || null,
        telegram_username?.trim() || null,
        address?.trim()           || null,
        company?.trim()           || null,
        about?.trim()             || null,
        req.partner.id,
      ]
    );

    // Return updated partner
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, additional_phone, telegram_username,
              address, id_number, dob, education_level, institution,
              field_of_study, company, experience, message, passion, about,
              status, approved_at, created_at
       FROM partners WHERE id = ?`,
      [req.partner.id]
    );

    res.json({ success: true, message: 'Profile updated successfully.', data: rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── PUT /api/partners/me/password  (change password) ─────────
router.put('/me/password', requirePartner, async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }
    if (new_password !== confirm_password) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }

    const [rows] = await pool.execute(
      'SELECT password_hash FROM partners WHERE id = ?',
      [req.partner.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await pool.execute('UPDATE partners SET password_hash = ? WHERE id = ?', [newHash, req.partner.id]);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
module.exports.requirePartner = requirePartner;
