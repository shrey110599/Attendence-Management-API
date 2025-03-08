const express = require("express");
const { applyLeave, updateLeaveStatus, getAllLeaves,getEmployeeLeaves  } = require("../controllers/leaveController");

const router = express.Router();

router.post("/apply",  applyLeave);
router.put("/update/:leaveId", updateLeaveStatus);
router.get("/all",  getAllLeaves);
router.get("/employee/:employeeId", getEmployeeLeaves);
module.exports = router;
