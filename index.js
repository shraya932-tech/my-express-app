const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Test Connection & Sync Models (Creates Table in MySQL)
sequelize.authenticate()
  .then(() => {
    console.log('[SEQUELIZE] Database connection established successfully.');
    return sequelize.sync({ alter: true }); // Automatically creates/updates tables
  })
  .then(() => {
    console.log('[SEQUELIZE] Models synchronized with MySQL database.');
  })
  .catch((error) => {
    console.error('[SEQUELIZE ERROR] Unable to connect:', error);
  });

// Sample Route to Verify Setup
app.get('/', (req, res) => {
  res.json({ message: 'Sequelize ORM Express App Running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});