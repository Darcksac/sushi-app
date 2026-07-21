const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sushi-app',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// Admin: Upload image
router.post('/', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Cloudinary returns the full URL in req.file.path
    const imageUrl = req.file.path;
    
    res.status(201).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
