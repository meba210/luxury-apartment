// const express = require('express');
// const router  = require('express').Router();
// const pool    = require('../config/db');
// const jwt     = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'milevia_jwt_secret_change_in_production';

// // ── Admin JWT guard ───────────────────────────────────────────
// function requireAdmin(req, res, next) {
//   const auth = req.headers.authorization;
//   if (!auth || !auth.startsWith('Bearer ')) {
//     return res.status(401).json({ success: false, message: 'Unauthorized' });
//   }
//   try {
//     const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Admin access required' });
//     }
//     req.admin = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ success: false, message: 'Invalid or expired token' });
//   }
// }

// // ── JSON helpers ──────────────────────────────────────────────
// function parseJSON(val, fallback = []) {
//   if (Array.isArray(val)) return val;
//   if (typeof val === 'string') {
//     try { return JSON.parse(val); } catch { return fallback; }
//   }
//   return fallback;
// }

// function toJSONString(val) {
//   if (Array.isArray(val)) return JSON.stringify(val);
//   if (typeof val === 'string') {
//     try { JSON.parse(val); return val; } catch { /* fall */ }
//   }
//   return '[]';
// }

// function mapApt(apt) {
//   return {
//     ...apt,
//     amenities:   parseJSON(apt.amenities),
//     images:      parseJSON(apt.images),
//     video_links: parseJSON(apt.video_links),
//   };
// }

// // ══════════════════════════════════════════════════════════════
// // PUBLIC ROUTES
// // ══════════════════════════════════════════════════════════════

// // GET /api/apartments/meta/locations  — must be BEFORE /:id
// router.get('/meta/locations', async (req, res) => {
//   try {
//     const [rows] = await pool.execute('SELECT * FROM locations ORDER BY name');
//     res.json({ success: true, data: rows });
//   } catch (err) {
//     console.error('Locations error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // GET /api/apartments  — public listing (2+ beds, available)
// router.get('/', async (req, res) => {
//   try {
//     const { bedrooms, location_id, location_name,
//             min_price, max_price, featured, property_type } = req.query;

//     let query = `
//       SELECT a.*, l.name as location_name, l.description as location_description
//       FROM apartments a
//       LEFT JOIN locations l ON a.location_id = l.id
//       WHERE a.is_available = 1 AND a.bedrooms >= 2
//     `;
//     const params = [];

//     if (property_type) { query += ' AND a.property_type = ?'; params.push(property_type); }
//     if (bedrooms)       { query += ' AND a.bedrooms = ?';      params.push(parseInt(bedrooms)); }
//     if (location_name)  { query += ' AND l.name = ?';          params.push(location_name); }
//     else if (location_id) { query += ' AND a.location_id = ?'; params.push(parseInt(location_id)); }
//     if (min_price)      { query += ' AND a.price_etb >= ?';    params.push(parseFloat(min_price)); }
//     if (max_price)      { query += ' AND a.price_etb <= ?';    params.push(parseFloat(max_price)); }
//     if (featured === 'true') { query += ' AND a.is_featured = TRUE'; }

//     query += ' ORDER BY a.is_featured DESC, a.created_at DESC';

//     const [rows] = await pool.execute(query, params);
//     res.json({ success: true, data: rows.map(mapApt), count: rows.length });
//   } catch (err) {
//     console.error('List apartments error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // GET /api/apartments/:id  — single apartment (public)
// router.get('/:id', async (req, res) => {
//   try {
//     const [rows] = await pool.execute(
//       `SELECT a.*, l.name as location_name, l.description as location_description
//        FROM apartments a
//        LEFT JOIN locations l ON a.location_id = l.id
//        WHERE a.id = ?`,
//       [req.params.id]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Apartment not found' });
//     }
//     res.json({ success: true, data: mapApt(rows[0]) });
//   } catch (err) {
//     console.error('Get apartment error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ══════════════════════════════════════════════════════════════
// // ADMIN ROUTES (JWT protected)
// // ══════════════════════════════════════════════════════════════

// // POST /api/apartments  — create new apartment listing
// router.post('/', requireAdmin, async (req, res) => {
//   try {
//     const {
//       title, description, bedrooms, bathrooms,
//       size_sqm, price_etb, price_usd, property_type,
//       location_id, floor, total_floors,
//       amenities, images, video_links,
//       is_featured, is_available,
//     } = req.body;

//     if (!title || !bedrooms || !bathrooms || !price_etb) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title, bedrooms, bathrooms and price (ETB) are required.',
//       });
//     }
//     if (parseInt(bedrooms) < 2) {
//       return res.status(400).json({
//         success: false,
//         message: 'Only apartments with 2 or more bedrooms are allowed.',
//       });
//     }

//     const validTypes = ['Apartment', 'Duplex', 'Penthouse'];
//     const propType   = validTypes.includes(property_type) ? property_type : 'Apartment';

//     const [result] = await pool.execute(
//       `INSERT INTO apartments
//          (title, description, bedrooms, bathrooms, size_sqm,
//           price_etb, price_usd, property_type,
//           location_id, floor, total_floors,
//           amenities, images, video_links,
//           is_featured, is_available)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         title.trim(),
//         description?.trim() || null,
//         parseInt(bedrooms),
//         parseInt(bathrooms),
//         size_sqm     ? parseFloat(size_sqm)    : null,
//         parseFloat(price_etb),
//         price_usd    ? parseFloat(price_usd)   : null,
//         propType,
//         location_id  ? parseInt(location_id)   : null,
//         floor        ? parseInt(floor)         : null,
//         total_floors ? parseInt(total_floors)  : null,
//         toJSONString(amenities),
//         toJSONString(images),
//         toJSONString(video_links),
//         is_featured  ? 1 : 0,
//         is_available !== false ? 1 : 0,
//       ]
//     );

//     const [newRows] = await pool.execute(
//       `SELECT a.*, l.name as location_name
//        FROM apartments a LEFT JOIN locations l ON a.location_id = l.id
//        WHERE a.id = ?`,
//       [result.insertId]
//     );

//     res.status(201).json({
//       success: true,
//       message: `Apartment "${title}" posted successfully.`,
//       id:   result.insertId,
//       data: newRows.length ? mapApt(newRows[0]) : null,
//     });
//   } catch (err) {
//     console.error('Post apartment error:', err);
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // PUT /api/apartments/:id  — full edit (admin)
// router.put('/:id', requireAdmin, async (req, res) => {
//   try {
//     const {
//       title, description, bedrooms, bathrooms,
//       size_sqm, price_etb, price_usd, property_type,
//       location_id, floor, total_floors,
//       amenities, images, video_links,
//       is_featured, is_available,
//     } = req.body;

//     if (!title || !bedrooms || !bathrooms || !price_etb) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title, bedrooms, bathrooms and price are required.',
//       });
//     }
//     if (parseInt(bedrooms) < 2) {
//       return res.status(400).json({
//         success: false,
//         message: 'Only apartments with 2 or more bedrooms are allowed.',
//       });
//     }

//     const validTypes = ['Apartment', 'Duplex', 'Penthouse'];
//     const propType   = validTypes.includes(property_type) ? property_type : 'Apartment';

//     await pool.execute(
//       `UPDATE apartments SET
//          title = ?, description = ?, bedrooms = ?, bathrooms = ?, size_sqm = ?,
//          price_etb = ?, price_usd = ?, property_type = ?,
//          location_id = ?, floor = ?, total_floors = ?,
//          amenities = ?, images = ?, video_links = ?,
//          is_featured = ?, is_available = ?
//        WHERE id = ?`,
//       [
//         title.trim(),
//         description?.trim() || null,
//         parseInt(bedrooms),
//         parseInt(bathrooms),
//         size_sqm     ? parseFloat(size_sqm)    : null,
//         parseFloat(price_etb),
//         price_usd    ? parseFloat(price_usd)   : null,
//         propType,
//         location_id  ? parseInt(location_id)   : null,
//         floor        ? parseInt(floor)         : null,
//         total_floors ? parseInt(total_floors)  : null,
//         toJSONString(amenities),
//         toJSONString(images),
//         toJSONString(video_links),
//         is_featured  ? 1 : 0,
//         is_available !== false ? 1 : 0,
//         req.params.id,
//       ]
//     );

//     const [updated] = await pool.execute(
//       `SELECT a.*, l.name as location_name
//        FROM apartments a LEFT JOIN locations l ON a.location_id = l.id
//        WHERE a.id = ?`,
//       [req.params.id]
//     );

//     res.json({
//       success: true,
//       message: 'Apartment updated successfully.',
//       data: updated.length ? mapApt(updated[0]) : null,
//     });
//   } catch (err) {
//     console.error('Edit apartment error:', err);
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // PATCH /api/apartments/:id  — toggle featured / available only
// router.patch('/:id', requireAdmin, async (req, res) => {
//   try {
//     const { is_featured, is_available } = req.body;
//     const updates = [];
//     const params  = [];

//     if (is_featured  !== undefined) { updates.push('is_featured = ?');  params.push(is_featured  ? 1 : 0); }
//     if (is_available !== undefined) { updates.push('is_available = ?'); params.push(is_available ? 1 : 0); }

//     if (updates.length === 0) {
//       return res.status(400).json({ success: false, message: 'Nothing to update.' });
//     }

//     params.push(req.params.id);
//     await pool.execute(`UPDATE apartments SET ${updates.join(', ')} WHERE id = ?`, params);
//     res.json({ success: true, message: 'Apartment updated.' });
//   } catch (err) {
//     console.error('Patch apartment error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // DELETE /api/apartments/:id
// router.delete('/:id', requireAdmin, async (req, res) => {
//   try {
//     await pool.execute('DELETE FROM apartments WHERE id = ?', [req.params.id]);
//     res.json({ success: true, message: 'Apartment deleted.' });
//   } catch (err) {
//     console.error('Delete apartment error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = require('express').Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET =
  process.env.JWT_SECRET || 'milevia_jwt_secret_change_in_production';

// ── Admin JWT guard ───────────────────────────────────────────
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

// ── JSON helpers ──────────────────────────────────────────────
function parseJSON(val, fallback = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function toJSONString(val) {
  if (Array.isArray(val)) return JSON.stringify(val);
  if (typeof val === 'string') {
    try {
      JSON.parse(val);
      return val;
    } catch {
      /* fall */
    }
  }
  return '[]';
}

function mapApt(apt) {
  return {
    ...apt,
    amenities: parseJSON(apt.amenities),
    images: parseJSON(apt.images),
    video_links: parseJSON(apt.video_links),
  };
}

// ══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════

// GET /api/apartments/meta/locations  — must be BEFORE /:id
router.get('/meta/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Locations error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/apartments  — public listing (2+ beds, available)
router.get('/', async (req, res) => {
  try {
    const {
      bedrooms,
      location_id,
      location_name,
      min_price,
      max_price,
      featured,
      property_type,
    } = req.query;

    let query = `
      SELECT a.*, l.name as location_name, l.description as location_description
      FROM apartments a
      LEFT JOIN locations l ON a.location_id = l.id
      WHERE a.is_available = true AND a.bedrooms >= 2
    `;
    const params = [];
    let paramIndex = 1;

    if (property_type) {
      query += ` AND a.property_type = $${paramIndex}`;
      params.push(property_type);
      paramIndex++;
    }
    if (bedrooms) {
      query += ` AND a.bedrooms = $${paramIndex}`;
      params.push(parseInt(bedrooms));
      paramIndex++;
    }
    if (location_name) {
      query += ` AND l.name = $${paramIndex}`;
      params.push(location_name);
      paramIndex++;
    } else if (location_id) {
      query += ` AND a.location_id = $${paramIndex}`;
      params.push(parseInt(location_id));
      paramIndex++;
    }
    if (min_price) {
      query += ` AND a.price_etb >= $${paramIndex}`;
      params.push(parseFloat(min_price));
      paramIndex++;
    }
    if (max_price) {
      query += ` AND a.price_etb <= $${paramIndex}`;
      params.push(parseFloat(max_price));
      paramIndex++;
    }
    if (featured === 'true') {
      query += ' AND a.is_featured = true';
    }

    query += ' ORDER BY a.is_featured DESC, a.created_at DESC';

    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows.map(mapApt),
      count: result.rows.length,
    });
  } catch (err) {
    console.error('List apartments error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/apartments/:id  — single apartment (public)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, l.name as location_name, l.description as location_description
       FROM apartments a
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Apartment not found' });
    }
    res.json({ success: true, data: mapApt(result.rows[0]) });
  } catch (err) {
    console.error('Get apartment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ══════════════════════════════════════════════════════════════
// ADMIN ROUTES (JWT protected)
// ══════════════════════════════════════════════════════════════

// POST /api/apartments  — create new apartment listing
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
      property_type,
      location_id,
      floor,
      total_floors,
      amenities,
      images,
      video_links,
      is_featured,
      is_available,
    } = req.body;

    if (!title || !bedrooms || !bathrooms || !price_etb) {
      return res.status(400).json({
        success: false,
        message: 'Title, bedrooms, bathrooms and price (ETB) are required.',
      });
    }
    if (parseInt(bedrooms) < 2) {
      return res.status(400).json({
        success: false,
        message: 'Only apartments with 2 or more bedrooms are allowed.',
      });
    }

    const validTypes = ['Apartment', 'Duplex', 'Penthouse'];
    const propType = validTypes.includes(property_type)
      ? property_type
      : 'Apartment';

    const result = await pool.query(
      `INSERT INTO apartments
         (title, description, bedrooms, bathrooms, size_sqm,
          price_etb, price_usd, property_type,
          location_id, floor, total_floors,
          amenities, images, video_links,
          is_featured, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id`,
      [
        title.trim(),
        description?.trim() || null,
        parseInt(bedrooms),
        parseInt(bathrooms),
        size_sqm ? parseFloat(size_sqm) : null,
        parseFloat(price_etb),
        price_usd ? parseFloat(price_usd) : null,
        propType,
        location_id ? parseInt(location_id) : null,
        floor ? parseInt(floor) : null,
        total_floors ? parseInt(total_floors) : null,
        toJSONString(amenities),
        toJSONString(images),
        toJSONString(video_links),
        is_featured ? true : false,
        is_available !== false ? true : false,
      ]
    );

    const newResult = await pool.query(
      `SELECT a.*, l.name as location_name
       FROM apartments a LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      success: true,
      message: `Apartment "${title}" posted successfully.`,
      id: result.rows[0].id,
      data: newResult.rows.length ? mapApt(newResult.rows[0]) : null,
    });
  } catch (err) {
    console.error('Post apartment error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/apartments/:id  — full edit (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      bedrooms,
      bathrooms,
      size_sqm,
      price_etb,
      price_usd,
      property_type,
      location_id,
      floor,
      total_floors,
      amenities,
      images,
      video_links,
      is_featured,
      is_available,
    } = req.body;

    if (!title || !bedrooms || !bathrooms || !price_etb) {
      return res.status(400).json({
        success: false,
        message: 'Title, bedrooms, bathrooms and price are required.',
      });
    }
    if (parseInt(bedrooms) < 2) {
      return res.status(400).json({
        success: false,
        message: 'Only apartments with 2 or more bedrooms are allowed.',
      });
    }

    const validTypes = ['Apartment', 'Duplex', 'Penthouse'];
    const propType = validTypes.includes(property_type)
      ? property_type
      : 'Apartment';

    await pool.query(
      `UPDATE apartments SET
         title = $1, description = $2, bedrooms = $3, bathrooms = $4, size_sqm = $5,
         price_etb = $6, price_usd = $7, property_type = $8,
         location_id = $9, floor = $10, total_floors = $11,
         amenities = $12, images = $13, video_links = $14,
         is_featured = $15, is_available = $16
       WHERE id = $17`,
      [
        title.trim(),
        description?.trim() || null,
        parseInt(bedrooms),
        parseInt(bathrooms),
        size_sqm ? parseFloat(size_sqm) : null,
        parseFloat(price_etb),
        price_usd ? parseFloat(price_usd) : null,
        propType,
        location_id ? parseInt(location_id) : null,
        floor ? parseInt(floor) : null,
        total_floors ? parseInt(total_floors) : null,
        toJSONString(amenities),
        toJSONString(images),
        toJSONString(video_links),
        is_featured ? true : false,
        is_available !== false ? true : false,
        req.params.id,
      ]
    );

    const updatedResult = await pool.query(
      `SELECT a.*, l.name as location_name
       FROM apartments a LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.id = $1`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Apartment updated successfully.',
      data: updatedResult.rows.length ? mapApt(updatedResult.rows[0]) : null,
    });
  } catch (err) {
    console.error('Edit apartment error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

// PATCH /api/apartments/:id  — toggle featured / available only
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { is_featured, is_available } = req.body;
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (is_featured !== undefined) {
      updates.push(`is_featured = $${paramIndex}`);
      params.push(is_featured ? true : false);
      paramIndex++;
    }
    if (is_available !== undefined) {
      updates.push(`is_available = $${paramIndex}`);
      params.push(is_available ? true : false);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Nothing to update.' });
    }

    params.push(req.params.id);
    await pool.query(
      `UPDATE apartments SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    );
    res.json({ success: true, message: 'Apartment updated.' });
  } catch (err) {
    console.error('Patch apartment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/apartments/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM apartments WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Apartment deleted.' });
  } catch (err) {
    console.error('Delete apartment error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;