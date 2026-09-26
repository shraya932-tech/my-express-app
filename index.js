const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Student = require('./models/Student');
const Course = require('./models/Course');
const StudentCourse = require('./models/StudentCourse');

const app = express();
app.use(cors());
app.use(express.json());

// ================= DEFINE MANY-TO-MANY ASSOCIATION ================= //
Student.belongsToMany(Course, { through: StudentCourse });
Course.belongsToMany(Student, { through: StudentCourse });

// ================= ENDPOINTS ================= //

// 1. Create a Student
app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Create a Course
app.post('/courses', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Enroll Student in a Course (Adding entry to junction table)
app.post('/students/:studentId/courses/:courseId', async (req, res) => {
  const { studentId, courseId } = req.params;
  try {
    const student = await Student.findByPk(studentId);
    const course = await Course.findByPk(courseId);

    if (!student || !course) {
      return res.status(404).json({ error: 'Student or Course not found' });
    }

    await student.addCourse(course);
    res.json({ message: `Student ${studentId} enrolled in Course ${courseId} successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Retrieve Student with their Enrolled Courses
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: Course
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync Database & Start Server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('[SEQUELIZE] Many-to-Many associations synced successfully.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('[DB ERROR]', err.message));