const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByEmployee,
} = require("../controllers/taskController");

const { verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyAdmin, createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/employee/:employeeId", getTasksByEmployee);

module.exports = router;
