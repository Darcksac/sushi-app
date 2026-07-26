const express = require('express');
const { Dish, Review, User } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all available dishes (Public)
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.findAll({ 
      where: { isAvailable: true },
      include: [{ model: Review, include: [{ model: User, attributes: ['id', 'email'] }] }]
    });
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

// Client: Post a review
router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const review = await Review.create({
      rating,
      comment,
      DishId: dish.id,
      UserId: req.userId
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
