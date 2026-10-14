require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const useSqlite = process.env.USE_SQLITE === 'true' ||
                  !process.env.DATABASE_URL ||
                  process.env.DATABASE_URL.startsWith('sqlite');

let sequelize;

if (useSqlite) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Disable query logging for cleaner console
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
}

module.exports = sequelize;

