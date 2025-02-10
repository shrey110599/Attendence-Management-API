const express = require("express");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

// Get all activity logs (Admin only)
router.get("/activity-log", async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate("userId", "name email role");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
