const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes);

// Sync DB & Start Server
sequelize.sync()
  .then(() => {
    console.log('[SEQUELIZE] Database connected & synced.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('[DB ERROR]', err.message));