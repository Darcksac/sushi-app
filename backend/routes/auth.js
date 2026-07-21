const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const { SECRET, verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const GOOGLE_CLIENT_ID = '1076641705836-2qtbe4i5gqv0i8t2mu8vh20r3i7a7bs1.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, address, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'client',
      address,
      phone
    });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, email: user.email, id: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = jwt.decode(idToken);
    if (!decodedToken || !decodedToken.email) {
      return res.status(400).json({ message: 'Invalid Google Token' });
    }

    const email = decodedToken.email;
    let user = await User.findOne({ where: { email } });

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await User.create({
        email,
        password: randomPassword,
        role: 'client'
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, email: user.email, id: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ['id', 'email', 'role', 'address', 'phone'] });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
