const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || 'milevia_jwt_secret_change_in_production';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Configure multer for file uploads ─────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/jpg',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

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

// ── POST /api/uploads - Upload single image ───────────────────
router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
    }

    // Return the file URL relative to the backend server
    const origin = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${origin}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Upload failed', error: error.message });
  }
});

// ── DELETE /api/uploads/:filename - Delete uploaded image ─────
router.delete('/:filename', requireAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    // Security: prevent directory traversal
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'File deleted' });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

module.exports = router;
