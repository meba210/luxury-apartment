const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAdmin } = require('./admin');

// Get all locations - must be before /:id to avoid conflict
router.get('/meta/locations', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM locations ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all apartments with optional filters
router.get('/', async (req, res) => {
  try {
    const { bedrooms, location_id, min_price, max_price, featured } = req.query;

    // Always enforce: only apartments with 2+ bedrooms, available for sale
    let query = `
      SELECT a.*, l.name as location_name, l.description as location_description
      FROM apartments a
      LEFT JOIN locations l ON a.location_id = l.id
      WHERE a.is_available = TRUE
        AND a.bedrooms >= 2
    `;
    const params = [];

    if (bedrooms) {
      query += ' AND a.bedrooms = ?';
      params.push(parseInt(bedrooms));
    }
    if (location_id) {
      query += ' AND a.location_id = ?';
      params.push(parseInt(location_id));
    }
    if (min_price) {
      query += ' AND a.price_etb >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      query += ' AND a.price_etb <= ?';
      params.push(parseFloat(max_price));
    }
    if (featured === 'true') {
      query += ' AND a.is_featured = TRUE';
    }

    query += ' ORDER BY a.is_featured DESC, a.created_at DESC';

    const [rows] = await pool.execute(query, params);

    const apartments = rows.map((apt) => ({
      ...apt,
      amenities:
        typeof apt.amenities === 'string'
          ? JSON.parse(apt.amenities)
          : apt.amenities,
      images:
        typeof apt.images === 'string' ? JSON.parse(apt.images) : apt.images,
    }));

    res.json({ success: true, data: apartments, count: apartments.length });
  } catch (error) {
    console.error('Error fetching apartments:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single apartment
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, l.name as location_name, l.description as location_description
       FROM apartments a
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Apartment not found' });
    }

    const apt = rows[0];
    apt.amenities =
      typeof apt.amenities === 'string'
        ? JSON.parse(apt.amenities)
        : apt.amenities;
    apt.images =
      typeof apt.images === 'string' ? JSON.parse(apt.images) : apt.images;

    res.json({ success: true, data: apt });
  } catch (error) {
    console.error('Error fetching apartment:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

// ── Admin: POST new apartment ─────────────────────────────────
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      bedrooms,
      bathrooms,
      size_sqm,
      price_etb,
      price_usd,
      location_id,
      floor,
      total_floors,
      amenities,
      images,
      is_featured,
      is_available,
    } = req.body;

    if (!title || !bedrooms || !bathrooms || !price_etb) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Title, bedrooms, bathrooms and price are required.',
        });
    }
    if (parseInt(bedrooms) < 2) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Only apartments with 2 or more bedrooms are allowed.',
        });
    }

    const amenitiesJson = Array.isArray(amenities)
      ? JSON.stringify(amenities)
      : amenities || '[]';
    const imagesJson = Array.isArray(images)
      ? JSON.stringify(images)
      : images || '[]';

    const [result] = await pool.execute(
      `INSERT INTO apartments
        (title, description, bedrooms, bathrooms, size_sqm, price_etb, price_usd,
         location_id, floor, total_floors, amenities, images, is_featured, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        parseInt(bedrooms),
        parseInt(bathrooms),
        size_sqm ? parseFloat(size_sqm) : null,
        parseFloat(price_etb),
        price_usd ? parseFloat(price_usd) : null,
        location_id ? parseInt(location_id) : null,
        floor ? parseInt(floor) : null,
        total_floors ? parseInt(total_floors) : null,
        amenitiesJson,
        imagesJson,
        is_featured ? 1 : 0,
        is_available !== false ? 1 : 0,
      ]
    );

    res
      .status(201)
      .json({
        success: true,
        message: 'Apartment posted successfully.',
        id: result.insertId,
      });
  } catch (error) {
    console.error('Error posting apartment:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

// ── Admin: DELETE apartment ───────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM apartments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Apartment deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Admin: PATCH apartment (toggle featured/available) ────────
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { is_featured, is_available } = req.body;
    const updates = [];
    const params = [];
    if (is_featured !== undefined) {
      updates.push('is_featured = ?');
      params.push(is_featured ? 1 : 0);
    }
    if (is_available !== undefined) {
      updates.push('is_available = ?');
      params.push(is_available ? 1 : 0);
    }
    if (updates.length === 0)
      return res
        .status(400)
        .json({ success: false, message: 'Nothing to update.' });
    params.push(req.params.id);
    await pool.execute(
      `UPDATE apartments SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    res.json({ success: true, message: 'Apartment updated.' });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
