const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit a rating/review (public)
router.post('/', async (req, res) => {
  try {
    const { apartment_id, name, stars, comment } = req.body;
    if (!apartment_id || !name || !stars) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Apartment, name and stars are required.',
        });
    }
    const s = parseInt(stars);
    if (isNaN(s) || s < 1 || s > 5)
      return res
        .status(400)
        .json({ success: false, message: 'Stars must be 1-5.' });

    const [result] = await pool.execute(
      'INSERT INTO ratings (apartment_id, name, stars, comment) VALUES (?, ?, ?, ?)',
      [apartment_id, name, s, comment || null]
    );

    res
      .status(201)
      .json({
        success: true,
        message: 'Thank you for your rating.',
        id: result.insertId,
      });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get recent ratings (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, a.title as apartment_title
       FROM ratings r
       LEFT JOIN apartments a ON r.apartment_id = a.id
       ORDER BY r.created_at DESC LIMIT 20`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
