const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // or './util/database'

const User = require('./models/User');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

const app = express();

app.use(cors());
app.use(express.json());

// ================= DEFINE ASSOCIATIONS ================= //
// User <-> Booking (One-to-Many)
User.hasMany(Booking, { onDelete: 'CASCADE' });
Booking.belongsTo(User);

// Bus <-> Booking (One-to-Many)
Bus.hasMany(Booking, { onDelete: 'CASCADE' });
Booking.belongsTo(Bus);

// Booking <-> Payment (One-to-One)
Booking.hasOne(Payment, { onDelete: 'CASCADE' });
Payment.belongsTo(Booking);

// ================= INITIALIZE DB AND SEED DATA ================= //
const initDatabase = async () => {
  try {
    // Sync models and update schema with foreign keys
    await sequelize.sync({ force: true });
    console.log('[SEQUELIZE] Database synced with foreign key associations.');

    // 1. Create Users
    const user1 = await User.create({ name: 'John Doe', email: 'john@example.com' });
    const user2 = await User.create({ name: 'Jane Smith', email: 'jane@example.com' });

    // 2. Create Buses
    const bus1 = await Bus.create({ busNumber: 'BUS-101', totalSeats: 40, availableSeats: 25 });

    // 3. Create Sample Bookings linked with User IDs and Bus IDs
    const booking1 = await Booking.create({
      UserId: user1.id,
      BusId: bus1.id,
      seatNumber: 12
    });

    const booking2 = await Booking.create({
      UserId: user2.id,
      BusId: bus1.id,
      seatNumber: 15
    });

    console.log('[SEED] Inserted bookings linked to users successfully.');

  } catch (error) {
    console.error('[DATABASE INIT ERROR]', error.message);
  }
};

initDatabase();

// Route to fetch bookings with associated User data
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [User, Bus] });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});