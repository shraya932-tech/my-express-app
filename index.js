const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// Initialize Students Table
const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        age INT NOT NULL
      );
    `);
    console.log('[DB SETUP] Students table verified/created successfully.');
  } catch (error) {
    console.error('[DB SETUP ERROR]', error.message);
  }
};
initDb();

// 1. POST /students -> Insert a new student
app.post('/students', async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || age === undefined) {
    return res.status(400).json({ error: 'Name, email, and age are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO students (name, email, age) VALUES (?, ?, ?)',
      [name, email, age]
    );
    console.log(`[INSERT] Student added with ID: ${result.insertId}`);
    res.status(201).json({
      message: 'Student added successfully',
      studentId: result.insertId
    });
  } catch (error) {
    console.error('[INSERT ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /students -> Retrieve all students
app.get('/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    console.log(`[GET ALL] Retrieved ${rows.length} students.`);
    res.json(rows);
  } catch (error) {
    console.error('[GET ALL ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /students/:id -> Retrieve a student by ID
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [id]);

    if (rows.length === 0) {
      console.log(`[GET BY ID WARN] Student with ID ${id} not found.`);
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`[GET BY ID] Retrieved student ID: ${id}`);
    res.json(rows[0]);
  } catch (error) {
    console.error('[GET BY ID ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT /students/:id -> Update student details by ID
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    // Build dynamic update query depending on provided fields
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (age !== undefined) { updates.push('age = ?'); values.push(age); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Please provide fields to update' });
    }

    values.push(id);
    const query = `UPDATE students SET ${updates.join(', ')} WHERE id = ?`;

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      console.log(`[UPDATE WARN] Student with ID ${id} not found.`);
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`[UPDATE] Updated student with ID: ${id}`);
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('[UPDATE ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /students/:id -> Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM students WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      console.log(`[DELETE WARN] Student with ID ${id} not found.`);
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log(`[DELETE] Deleted student with ID: ${id}`);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('[DELETE ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});