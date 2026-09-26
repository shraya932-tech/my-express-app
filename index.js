const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// 1. Insertion: Create a new user
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
    console.log(`[INSERT] User inserted successfully with ID: ${result.insertId}`);
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('[INSERT ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Updating: Update user details by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required for update' });
  }

  try {
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );

    if (result.affectedRows === 0) {
      console.log(`[UPDATE WARN] User with ID ${id} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[UPDATE] User with ID ${id} updated successfully.`);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('[UPDATE ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. Deletion: Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      console.log(`[DELETE WARN] User with ID ${id} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[DELETE] User with ID ${id} deleted successfully.`);
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