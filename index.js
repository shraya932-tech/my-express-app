const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Adjust path if using ./util/database
const expenseRoutes = require('./routes/expense');

const app = express();

app.use(cors());
app.use(express.json());

// Expense Routes
app.use(expenseRoutes);

// Sync Database and Start Server
sequelize.sync()
  .then(() => {
    console.log('[SEQUELIZE] Database synced for Expense App.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('[DB ERROR]', err.message));