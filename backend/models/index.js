const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'client'), defaultValue: 'client' },
  address: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING }
});

const Dish = sequelize.define('Dish', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, defaultValue: 'Sushis' },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const Promotion = sequelize.define('Promotion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING },
  discountPercentage: { type: DataTypes.FLOAT, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const Coupon = sequelize.define('Coupon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  discountPercentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 },
  isUsed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'preparing', 'delivering', 'completed'), defaultValue: 'pending' },
  requestedDeliveryTime: { type: DataTypes.DATE },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT }
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.FLOAT, allowNull: false }
});

// Relationships
User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Coupon);
Coupon.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Dish.hasMany(OrderItem);
OrderItem.belongsTo(Dish);

module.exports = { User, Dish, Promotion, Order, OrderItem, Coupon, sequelize };
