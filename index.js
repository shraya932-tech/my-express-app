const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

const app = express();
app.use(express.json());

// Initialize DB and Seed Sample Data
const initDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Syncs models to MySQL tables
    console.log('[SEQUELIZE] Database & tables created.');

    // Add 3 Users using create()
    await User.bulkCreate([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Alice Johnson', email: 'alice@example.com' }
    ]);
    console.log('[SEED] Inserted 3 users successfully.');

    // Add 2 Buses using create()
    await Bus.bulkCreate([
      { busNumber: 'BUS-101', totalSeats: 40, availableSeats: 25 },
      { busNumber: 'BUS-202', totalSeats: 30, availableSeats: 15 }
    ]);
    console.log('[SEED] Inserted 2 buses successfully.');

  } catch (error) {
    console.error('[DATABASE INIT ERROR]', error.message);
  }
};

initDatabase();

// Basic verification route
app.get('/', (req, res) => {
  res.json({ message: 'Bus Booking App with Sequelize' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});