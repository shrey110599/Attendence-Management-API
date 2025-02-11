// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAvailableEmployees,
  getPresentEmployees,
  getEmployeeAttendanceDetails,
} = require("../controllers/attendanceController");

// Route to get employees who have NOT marked attendance today
router.get('/employees', getAvailableEmployees);

// Route to mark attendance for an employee
router.post('/mark', markAttendance);

// Route to get details of employees who have marked attendance today
router.get('/present', getPresentEmployees);


router.get("/details/:employeeId", getEmployeeAttendanceDetails);
module.exports = router;
