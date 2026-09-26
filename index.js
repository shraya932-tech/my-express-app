const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

app.use(cors());
app.use(express.json());

// ================= DEFINE ONE-TO-MANY ASSOCIATION ================= //
User.hasMany(Post, { onDelete: 'CASCADE' });
Post.belongsTo(User);

// ================= CONTROLLERS & ROUTES ================= //

// 1. POST /posts -> Create a post associated with a specific user
app.post('/users/:userId/posts', async (req, res) => {
  const { userId } = req.params;
  const { title, content } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = await user.createPost({ title, content });
    console.log(`[CREATE POST] Created post ID: ${post.id} for User ID: ${userId}`);
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('[CREATE POST ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /users/:userId/posts -> Retrieve all posts for a given user
app.get('/users/:userId/posts', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: [Post] // Includes all associated posts
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[GET USER POSTS] Retreived posts for User ID: ${userId}`);
    res.json(user);
  } catch (error) {
    console.error('[GET USER POSTS ERROR]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Sync Database and Start Server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('[SEQUELIZE] Database & One-to-Many associations synced.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DATABASE INIT ERROR]', err.message);
  });