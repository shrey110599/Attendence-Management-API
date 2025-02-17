const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAvailableEmployees,
  getPresentEmployees,
  getEmployeeAttendanceDetails,
  getCheckoutEmployees,  // New: Get employees eligible for checkout
  checkoutEmployee       // New: Checkout an employee
} = require("../controllers/attendanceController");

// Route to get employees who have NOT marked attendance today
router.get('/employees', getAvailableEmployees);

// Route to mark attendance for an employee
router.post('/mark', markAttendance);

// Route to get details of employees who have marked attendance today
router.get('/present', getPresentEmployees);

// Route to get employees eligible for checkout
router.get('/checkout-list', getCheckoutEmployees);

// Route to checkout an employee
router.post("/checkout", checkoutEmployee);

router.get("/details/:employeeId", getEmployeeAttendanceDetails);

module.exports = router;
