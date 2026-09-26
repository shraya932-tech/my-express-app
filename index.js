const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// ================= USER ENDPOINTS ================= //

// POST /users -> Add a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    console.log(`[INSERT USER] Inserted ID: ${result.insertId}`);
    res.status(201).json({
      message: 'User added successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('[INSERT USER ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /users -> Retrieve all users from the database
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    console.log(`[GET USERS] Retrieved ${rows.length} users`);
    res.json(rows);
  } catch (error) {
    console.error('[GET USERS ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ================= BUS ENDPOINTS ================= //

// POST /buses -> Add a new bus
app.post('/buses', async (req, res) => {
  const { busNumber, totalSeats, availableSeats } = req.body;

  if (!busNumber || totalSeats === undefined || availableSeats === undefined) {
    return res.status(400).json({ error: 'busNumber, totalSeats, and availableSeats are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO buses (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)',
      [busNumber, totalSeats, availableSeats]
    );
    console.log(`[INSERT BUS] Inserted ID: ${result.insertId}`);
    res.status(201).json({
      message: 'Bus added successfully',
      busId: result.insertId
    });
  } catch (error) {
    console.error('[INSERT BUS ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /buses/available/:seats -> Retrieve all buses with availableSeats greater than :seats
app.get('/buses/available/:seats', async (req, res) => {
  const minSeats = parseInt(req.params.seats, 10);

  if (isNaN(minSeats)) {
    return res.status(400).json({ error: 'Seats parameter must be a valid number' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM buses WHERE availableSeats > ?',
      [minSeats]
    );
    console.log(`[GET BUSES] Found ${rows.length} buses with availableSeats > ${minSeats}`);
    res.json(rows);
  } catch (error) {
    console.error('[GET BUSES ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});