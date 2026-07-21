const express = require('express');
const { Order, OrderItem, Dish, User } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Client: Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, requestedDeliveryTime, latitude, longitude } = req.body;
    let totalAmount = 0;
    
    // Calculate total
    for (const item of items) {
      const dish = await Dish.findByPk(item.dishId);
      if (dish) {
        totalAmount += dish.price * item.quantity;
      }
    }

    const order = await Order.create({
      UserId: req.userId,
      totalAmount,
      requestedDeliveryTime,
      latitude,
      longitude
    });

    for (const item of items) {
      const dish = await Dish.findByPk(item.dishId);
      if (dish) {
        await OrderItem.create({
          OrderId: order.id,
          DishId: item.dishId,
          quantity: item.quantity,
          unitPrice: dish.price
        });
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Client: Get my orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.userId },
      include: [{ model: OrderItem, include: [Dish] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all orders
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, include: [Dish] },
        { model: User, attributes: ['id', 'email', 'phone', 'address'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update order status
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    await order.update({ status });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
