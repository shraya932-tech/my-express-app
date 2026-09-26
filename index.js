const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Sync Database Model
sequelize.sync()
  .then(() => console.log('[SEQUELIZE] Database synced successfully.'))
  .catch((err) => console.error('[SEQUELIZE ERROR]', err.message));

// ================= CRUD OPERATIONS ================= //

// 1. INSERT: Add a new record
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = await User.create({ name, email });
    console.log(`[INSERT] User created with ID: ${newUser.id}`);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('[INSERT ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. READ ALL: Fetch all records using findAll()
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(`[READ ALL] Retrieved ${users.length} users.`);
    res.json(users);
  } catch (error) {
    console.error('[READ ALL ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. READ BY PK: Fetch single record using findByPk()
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      console.log(`[READ BY PK WARN] User with ID ${id} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[READ BY PK] Found user: ${user.name}`);
    res.json(user);
  } catch (error) {
    console.error('[READ BY PK ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE: Modify an existing record using update()
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const [updatedCount] = await User.update(
      { name, email },
      { where: { id } }
    );

    if (updatedCount === 0) {
      console.log(`[UPDATE WARN] User with ID ${id} not found or no changes made.`);
      return res.status(404).json({ error: 'User not found or no change' });
    }

    console.log(`[UPDATE] Updated user with ID: ${id}`);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('[UPDATE ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE: Remove a record using destroy()
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await User.destroy({ where: { id } });

    if (deletedCount === 0) {
      console.log(`[DELETE WARN] User with ID ${id} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[DELETE] Deleted user with ID: ${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[DELETE ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});