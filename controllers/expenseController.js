const Expense = require("../models/Expense");

// ✅ Create a new Expense (with file upload)
exports.createExpense = async (req, res) => {
  try {
    const { name, note, expenseCategory, expenseDate, amount, paymentMode, customer } = req.body;
    const attachReceipt = req.file ? req.file.path : null; // Store file path if uploaded

    // Validate required fields
    if (!name || !expenseCategory || !expenseDate || !amount || !paymentMode || !customer) {
      return res.status(400).json({ message: "❌ All required fields must be provided" });
    }

    const expense = new Expense({
      attachReceipt,
      name,
      note,
      expenseCategory,
      expenseDate,
      amount,
      paymentMode,
      customer,
    });

    await expense.save();
    res.status(201).json({ message: "✅ Expense recorded successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("customer", "company phone");
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ Get expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("customer", "company phone");
    if (!expense) {
      return res.status(404).json({ message: "❌ Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const attachReceipt = req.file ? req.file.path : req.body.attachReceipt;
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, { ...req.body, attachReceipt }, { new: true });

    if (!updatedExpense) {
      return res.status(404).json({ message: "❌ Expense not found" });
    }
    res.status(200).json({ message: "✅ Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ✅ Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "❌ Expense not found" });
    }
    res.status(200).json({ message: "✅ Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};
