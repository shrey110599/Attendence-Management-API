const express = require('express');
const { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middlewares/authMiddleware');
const { getUpcomingBirthdays } = require("../controllers/employeeController");
const router = express.Router();

// Employee management routes
router.post('/', protect, createEmployee);
router.get('/', getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete('/:id', protect, deleteEmployee);
router.get("/birthdays/upcoming", getUpcomingBirthdays); 

module.exports = router;    