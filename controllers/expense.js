const Expense = require('../models/Expense');

// 1. Add Expense
exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const newExpense = await Expense.create({ amount, description, category });
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Delete Expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Expense.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Edit Expense (Bonus Task)
exports.editExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, description, category } = req.body;

  try {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.category = category || expense.category;

    await expense.save();
    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};