const express = require('express');
const { Order, OrderItem, Dish, User, Coupon } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Client: Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, requestedDeliveryTime, latitude, longitude, couponCode } = req.body;
    let totalAmount = 0;
    
    // Calculate total
    for (const item of items) {
      const dish = await Dish.findByPk(item.dishId);
      if (dish) {
        totalAmount += dish.price * item.quantity;
      }
    }

    // Apply Coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode, UserId: req.userId, isUsed: false } });
      if (coupon) {
        if (new Date() > new Date(coupon.expiresAt)) {
          return res.status(400).json({ error: 'El cupón ha expirado.' });
        }
        const discountAmount = totalAmount * (coupon.discountPercentage / 100);
        totalAmount -= discountAmount;
        if (totalAmount < 0) totalAmount = 0;
        await coupon.update({ isUsed: true });
      } else {
        return res.status(400).json({ error: 'Cupón inválido o ya ha sido usado.' });
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
    
    if (status === 'completed') {
      const completedCount = await Order.count({
        where: { UserId: order.UserId, status: 'completed' }
      });
      
      let discountPercentage = 0;
      let prefix = '';
      if (completedCount > 0) {
        const cyclePosition = completedCount % 10;
        
        if (cyclePosition === 0) {
          discountPercentage = 40;
          prefix = '40OFF-';
        } else if (cyclePosition === 5) {
          discountPercentage = 20;
          prefix = '20OFF-';
        } else if (cyclePosition === 3) {
          discountPercentage = 10;
          prefix = '10OFF-';
        }
      }
      
      if (discountPercentage > 0) {
        const generateCode = () => prefix + Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
        await Coupon.create({
          code: generateCode(),
          discountPercentage,
          expiresAt,
          UserId: order.UserId
        });
      }
    }
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
