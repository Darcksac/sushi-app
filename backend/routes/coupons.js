const express = require('express');
const { Coupon } = require('../models');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get logged in user's unused coupons
router.get('/my-coupons', verifyToken, async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      where: { UserId: req.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
