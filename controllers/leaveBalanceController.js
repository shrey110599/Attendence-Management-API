const LeaveBalance = require("../models/LeaveBalance");

// Create Leave Type
exports.createLeaveType = async (req, res) => {
  try {
    const { leaveName, description, maxDaysAllowed } = req.body;
    const leaveType = new LeaveBalance({ leaveName, description, maxDaysAllowed });
    const savedLeaveType = await leaveType.save();
    res.status(201).json({ message: "Leave Type Created", data: savedLeaveType });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Leave Types
exports.getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveBalance.find();
    res.status(200).json(leaveTypes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Leave Type
exports.updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLeaveType = await LeaveBalance.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Leave Type Updated", data: updatedLeaveType });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Leave Type
exports.deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    await LeaveBalance.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave Type Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
