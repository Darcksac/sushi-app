const bcrypt = require('bcrypt');
const { sequelize, User, Dish, Promotion } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const hashedPassword = await bcrypt.hash('bsanchez10', 10);
    await User.create({
      email: 'bsanchez@pekiteki.com',
      password: hashedPassword,
      role: 'admin',
      address: 'Admin Headquarters',
      phone: '1234567890'
    });
    console.log('Admin user created');

    await Dish.create({
      name: 'Spicy Tuna Roll',
      description: 'Fresh tuna with spicy mayo and cucumber.',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isAvailable: true
    });

    await Dish.create({
      name: 'Dragon Roll',
      description: 'Eel and cucumber topped with avocado and unagi sauce.',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isAvailable: true
    });

    await Promotion.create({
      title: 'Summer Special',
      description: 'Get 20% off on all orders this weekend!',
      discountPercentage: 20,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isActive: true
    });

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
