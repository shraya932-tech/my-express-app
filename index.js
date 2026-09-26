const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// Endpoint to run database schema setup
app.get('/init-db', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        busNumber VARCHAR(255) NOT NULL,
        totalSeats INT NOT NULL,
        availableSeats INT NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        busId INT,
        seatNumber INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (busId) REFERENCES buses(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bookingId INT,
        amountPaid DECIMAL(10, 2) NOT NULL,
        paymentStatus VARCHAR(255) NOT NULL,
        FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
      );
    `);

    res.json({ message: 'Database schema created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});