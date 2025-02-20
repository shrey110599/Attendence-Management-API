const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAvailableEmployees,
  getPresentEmployees,
  getEmployeeAttendanceDetails,
  getCheckoutEmployees,
  checkoutEmployee,
  getAbsentEmployees,
} = require("../controllers/attendanceController");

// ✅ Get employees who have NOT marked attendance today
router.get('/employees', getAvailableEmployees);

// ✅ Mark attendance (Check-in)
router.post('/mark', markAttendance);

// ✅ Get employees who have checked in today
router.get('/present', getPresentEmployees);

// ✅ Get employees eligible for checkout
router.get('/checkout-list', getCheckoutEmployees);

// ✅ Checkout an employee
router.post("/checkout", checkoutEmployee);

// ✅ Get employees who are absent today
router.get("/absent", getAbsentEmployees);

// ✅ Get attendance details of a specific employee
router.get("/details/:employeeId", getEmployeeAttendanceDetails);

module.exports = router;
// Compare this snippet from controllers/attendanceController.js:
// // controllers/attendanceController.js 