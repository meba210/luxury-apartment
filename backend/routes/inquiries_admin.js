const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAdmin } = require('./admin');

// GET /api/admin/inquiries - list all inquiries with admin info
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT i.*, a.title as apartment_title, ad.username as assigned_to_username
       FROM inquiries i
       LEFT JOIN apartments a ON i.apartment_id = a.id
       LEFT JOIN admins ad ON i.assigned_to = ad.id
       ORDER BY i.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching admin inquiries:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/inquiries/:id - assign or update status
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { assigned_to, status } = req.body; // assigned_to = admin id
    const updates = [];
    const params = [];
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
      updates.push('handled_at = ?');
      params.push(new Date());
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (updates.length === 0)
      return res
        .status(400)
        .json({ success: false, message: 'Nothing to update.' });
    params.push(req.params.id);
    await pool.execute(
      `UPDATE inquiries SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    res.json({ success: true, message: 'Inquiry updated.' });
  } catch (error) {
    console.error('Error updating inquiry (admin):', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
