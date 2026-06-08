const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit inquiry
router.post('/', async (req, res) => {
  try {
    const { apartment_id, full_name, email, phone, message } = req.body;

    if (!full_name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const [result] = await pool.execute(
      'INSERT INTO inquiries (apartment_id, full_name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [apartment_id || null, full_name, email, phone || null, message]
    );

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will contact you shortly.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all inquiries (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT i.*, a.title as apartment_title
       FROM inquiries i
       LEFT JOIN apartments a ON i.apartment_id = a.id
       ORDER BY i.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
