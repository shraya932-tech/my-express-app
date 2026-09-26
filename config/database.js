const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_database_name',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'your_mysql_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log // Logs raw SQL queries to console
  }
);

module.exports = sequelize;