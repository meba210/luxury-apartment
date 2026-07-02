const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || 'milevia_jwt_secret_change_in_production';

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'luxury-apartments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    resource_type: 'image',
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Verify Admin JWT
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}

// Upload Image
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Upload failed',
    });
  }
});

// Delete Image
router.delete('/:publicId', requireAdmin, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Delete failed',
    });
  }
});

module.exports = router;
