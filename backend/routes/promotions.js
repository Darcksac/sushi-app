const express = require('express');
const { Promotion } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all active promotions (Public)
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.findAll({ where: { isActive: true } });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all promotions
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create promotion
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update promotion
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    await promotion.update(req.body);
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete promotion
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    await promotion.destroy();
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
