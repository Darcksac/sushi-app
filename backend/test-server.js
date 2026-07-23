const express = require('express');
const app = express();

const authMiddleware = require('./middleware/authMiddleware');
authMiddleware.verifyToken = (req, res, next) => next();
authMiddleware.isAdmin = (req, res, next) => next();

require('dotenv').config();

const uploadRoute = require('./routes/upload');

app.use('/api/upload', uploadRoute);

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Global error: ' + err.message });
});

app.listen(3001, () => console.log('Test server running on 3001'));
