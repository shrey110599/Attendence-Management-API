const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Employee applies for leave
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;

    // Validate if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const leave = new Leave({ employeeId, startDate, endDate, reason });
    await leave.save();
    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin updates leave status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );
    if (!leave)
      return res.status(404).json({ error: "Leave request not found" });

    res.json({ message: "Leave status updated", leave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leave requests (Admin only)
exports.getAllLeaves = async (req, res) => {
  try {
    // Fetch only leave requests that have a status of "Pending"
    const leaves = await Leave.find({ status: "Pending" }).populate(
      "employeeId",
      "firstName email Designation"
    );

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getEmployeeLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const leaves = await Leave.find({ employeeId }).populate(
      "employeeId",
      "firstName email Designation"
    );
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};