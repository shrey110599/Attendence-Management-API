const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const upload = require("../middleware/upload"); // File upload middleware

// CRUD routes for expenses
router.post("/", upload.single("attachReceipt"), expenseController.createExpense);
router.get("/", expenseController.getAllExpenses);
router.get("/:id", expenseController.getExpenseById);
router.put("/:id", upload.single("attachReceipt"), expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
