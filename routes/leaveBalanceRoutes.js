const express = require("express");
const router = express.Router();
const leaveBalanceController = require("../controllers/leaveBalanceController");

// ✅ Create Leave Type
router.post("/", leaveBalanceController.createLeaveType);

// ✅ Get All Leave Types
router.get("/", leaveBalanceController.getLeaveTypes);

// ✅ Update Leave Type
router.put("/:id", leaveBalanceController.updateLeaveType);

// ✅ Delete Leave Type
router.delete("/:id", leaveBalanceController.deleteLeaveType);

module.exports = router;
