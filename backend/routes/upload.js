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

const uploadMiddleware = upload.single('image');

// Admin: Upload image
router.post('/', verifyToken, isAdmin, (req, res) => {
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.error('Cloudinary/Multer error:', err);
      return res.status(400).json({ message: 'Error de imagen: ' + (err.message || 'Error desconocido') });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
      }
      
      // Cloudinary returns the full URL in req.file.path
      const imageUrl = req.file.path;
      
      res.status(201).json({ imageUrl });
    } catch (innerErr) {
      res.status(500).json({ message: innerErr.message });
    }
  });
});

module.exports = router;
