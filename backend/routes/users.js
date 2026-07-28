const express = require('express');
const { User } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (Admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'phone', 'address', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'phone', 'address', 'role']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { phone, address } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.phone = phone || user.phone;
    user.address = address || user.address;
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user: {
      id: user.id, email: user.email, phone: user.phone, address: user.address, role: user.role
    }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
