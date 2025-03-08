const express = require("express");
const { applyLeave, getEmployeeLeaveDetails,updateLeaveStatus,getAllLeaveDetails } = require("../controllers/leaveController");

const router = express.Router();

router.get("/all", getAllLeaveDetails);

// ✅ Apply Leave with CL, ML, and PL Calculation
router.post("/apply", applyLeave);

// ✅ Get Employee Leave Details
router.get("/details/:employeeId", getEmployeeLeaveDetails);

// ✅ Update Leave Status (Pending, Approved, Rejected)
router.put("/status/:leaveId", updateLeaveStatus);  


module.exports = router;
