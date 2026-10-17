const express = require('express');
const cors = require('cors');
const { sequelize, Dish } = require('./models');
const { seedData } = require('./seed');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('King Dogos GDL Backend Running');
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor: ' + (err.message || 'Desconocido') });
});

const PORT = process.env.PORT || 3000;

const syncOptions = sequelize.getDialect() === 'sqlite' ? {} : { alter: true };

sequelize.sync(syncOptions).then(async () => {
  console.log('Database connected and synced');
  try {
    const count = await Dish.count();
    if (count === 0) {
      console.log('No dishes detected. Populating initial King Dogos GDL data...');
      await seedData();
    }
  } catch (seedErr) {
    console.error('Error checking or running seed:', seedErr);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database: ', err);
  process.exit(1);
});
