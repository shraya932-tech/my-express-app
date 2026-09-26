const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= CONTROLLERS & ROUTES ================= //

// 1. POST /users -> Add new user from form
app.post('/users', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  try {
    const newUser = await User.create({ name, email, phone });
    console.log(`[INSERT USER] Added user with ID: ${newUser.id}`);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('[INSERT USER ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /users -> Retrieve all users for frontend display
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(`[GET USERS] Fetched ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('[GET USERS ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. DELETE /users/:id -> Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await User.destroy({ where: { id } });

    if (deletedCount === 0) {
      console.log(`[DELETE WARN] User with ID ${id} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[DELETE USER] Deleted user with ID: ${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[DELETE USER ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Sync Database and Start Server
sequelize.sync()
  .then(() => {
    console.log('[SEQUELIZE] Database connected & synced successfully.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DATABASE CONNECT ERROR]', err.message);
  });