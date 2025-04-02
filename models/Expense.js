const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    attachReceipt: {
      type: String, // Stores the file path (image or PDF)
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    expenseCategory: {
      type: String,
      required: true,
      trim: true,
    },
    expenseDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "UPI", "Other"],
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to the Customer Table
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
