const bcrypt = require('bcrypt');
const { sequelize, User, Dish, Promotion } = require('./models');

async function seed() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    // Create or update admin user
    const existingAdmin = await User.findOne({ where: { email: 'admin@kingdogos.com' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@kingdogos.com',
        password: hashedPassword,
        role: 'admin',
        address: 'Av. Chapultepec #450, Guadalajara, Jal.',
        phone: '3312345678'
      });
      console.log('Admin user admin@kingdogos.com created');
    }

    // Clear existing dishes and promotions to replace sushi with King Dogos
    await Dish.destroy({ where: {} });
    await Promotion.destroy({ where: {} });

    await Dish.create({
      name: 'King Dogo Clásico GDL',
      description: 'El tradicional tapatío: salchicha jumbo envuelta en tocino crujiente, jitomate, cebolla guisada, mostaza, mayonesa casera y crema.',
      price: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
      category: 'Dogos Clásicos',
      isAvailable: true,
      customizations: [
        { name: 'Cebolla caramelizada extra', price: 10 },
        { name: 'Jalapeño toreado', price: 8 },
        { name: 'Papas trituradas (Ruffles)', price: 12 },
        { name: 'Queso gouda gratinado', price: 20 }
      ]
    });

    await Dish.create({
      name: 'Dogo Monstruo King',
      description: 'Doble salchicha jumbo con tocino, costra de queso gouda y cheddar fundido, champiñones al ajillo, tocino extra picado y aderezo especial King.',
      price: 95.00,
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
      category: 'Dogos Especiales',
      isAvailable: true,
      customizations: [
        { name: 'Extra champiñones al ajillo', price: 15 },
        { name: 'Doble tocino crujiente', price: 20 },
        { name: 'Aderezo habanero tatemado', price: 10 }
      ]
    });

    await Dish.create({
      name: 'Dogo Hawaiano King',
      description: 'Salchicha envuelta en tocino dorado, piña asada caramelizada, jamón de pierna a la plancha, queso manchego fundido y toque BBQ dulce.',
      price: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80',
      category: 'Dogos Especiales',
      isAvailable: true,
      customizations: [
        { name: 'Extra piña asada', price: 12 },
        { name: 'Queso fundido extra', price: 18 }
      ]
    });

    await Dish.create({
      name: 'Dogo Sonora Fuego',
      description: 'Estilo sonorense con frijoles bayos refritos, salchicha con tocino, queso asadero derretido, cebollita asada y chile güerito toreado con aderezo chipotle.',
      price: 90.00,
      imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
      category: 'Dogos Especiales',
      isAvailable: true,
      customizations: [
        { name: 'Chile güerito con queso extra', price: 25 },
        { name: 'Guacamole fresco', price: 20 }
      ]
    });

    await Dish.create({
      name: 'Papas King Loaded',
      description: 'Papas a la francesa sazonadas, bañadas en queso cheddar líquido caliente, tocino crujiente picado y jalapeños encurtidos.',
      price: 75.00,
      imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
      category: 'Snacks & Papas',
      isAvailable: true,
      customizations: [
        { name: 'Salchicha picada dorada', price: 20 },
        { name: 'Extra queso cheddar', price: 15 }
      ]
    });

    await Dish.create({
      name: 'Aros de Cebolla King',
      description: 'Aros de cebolla empanizados extra crujientes acompañados de dip ranch y salsa BBQ.',
      price: 60.00,
      imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      category: 'Snacks & Papas',
      isAvailable: true,
      customizations: [
        { name: 'Aderezo extra', price: 10 }
      ]
    });

    await Dish.create({
      name: 'Coca-Cola de Vidrio 500ml',
      description: 'Refresco bien frío en botella de cristal clásica.',
      price: 35.00,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      category: 'Bebidas',
      isAvailable: true,
      customizations: []
    });

    await Promotion.create({
      title: 'Combo Pareja King',
      description: '2 Dogos Clásicos GDL + 1 Papas King Loaded + 2 Refrescos de cristal con 20% de descuento.',
      discountPercentage: 20,
      imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
      isActive: true
    });

    await Promotion.create({
      title: 'Miércoles de Dogos 2x1',
      description: 'En la compra de tu Dogo Especial favorito, ¡llévate el segundo Dogo Clásico gratis!',
      discountPercentage: 50,
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
      isActive: true
    });

    console.log('King Dogos GDL data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
    throw err;
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedData: seed };
