const express = require('express');
const { Dish } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all available dishes (Public)
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.findAll({ where: { isAvailable: true } });
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all dishes (including unavailable)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const dishes = await Dish.findAll();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create a dish
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.status(201).json(dish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update a dish
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    await dish.update(req.body);
    res.json(dish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete a dish
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    await dish.destroy();
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
