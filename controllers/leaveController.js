const Leave = require("../models/Leave");
const moment = require("moment");
const Employee = require("../models/Employee");


// ✅ Apply Leave with Annual Leave Allocation
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, employmentDetails, leaveDetails } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const from = moment(leaveDetails.fromDate);
    const to = moment(leaveDetails.toDate);
    const days = to.diff(from, "days") + 1;

    const year = from.year();
    const month = from.month() + 1;

    // ✅ Fetch the most recent leave record to get available balances
    const latestLeaveRecord = await Leave.findOne({ employee: employeeId }).sort({ createdAt: -1 });

    // ✅ Default leave balance if no previous record exists
    const defaultLeaveBalance = {
      cl: { opBal: 12, clBal: 12, less: 0 },
      ml: { opBal: 6, clBal: 6, less: 0 },
      pl: { opBal: 12, clBal: 12, less: 0 },
      total: { opBal: 30, clBal: 30, less: 0 },
    };

    let availableLeaves = latestLeaveRecord ? { ...latestLeaveRecord.leaveAvailable } : defaultLeaveBalance;

    // ✅ Deduct leave from the correct category
    if (leaveDetails.natureOfLeave === "Paid") {
      if (availableLeaves.pl.clBal < days) {
        return res.status(400).json({ message: "Not enough Paid Leave available" });
      }
      availableLeaves.pl.clBal -= days;
      availableLeaves.pl.less += days;
    } else if (leaveDetails.natureOfLeave === "Medical") {
      if (availableLeaves.ml.clBal < days) {
        return res.status(400).json({ message: "Not enough Medical Leave available" });
      }
      availableLeaves.ml.clBal -= days;
      availableLeaves.ml.less += days;
    } else if (leaveDetails.natureOfLeave === "Casual") {
      if (availableLeaves.cl.clBal < days) {
        return res.status(400).json({ message: "Not enough Casual Leave available" });
      }
      availableLeaves.cl.clBal -= days;
      availableLeaves.cl.less += days;
    }

    // ✅ Update total leave balance
    availableLeaves.total.less += days;
    availableLeaves.total.clBal = availableLeaves.cl.clBal + availableLeaves.ml.clBal + availableLeaves.pl.clBal;

    // ✅ Create a new leave record for each request (NO OVERWRITING)
    const newLeaveRecord = new Leave({
      employee: employeeId,
      year,
      month,
      employmentDetails,
      leaveDetails,
      status: "Pending",
      leaveAvailable: availableLeaves, // ✅ Store new balances without overwriting old ones
      createdAt: new Date(), // ✅ Store timestamp for proper history
    });

    await newLeaveRecord.save();

    res.status(201).json({ message: "Leave request submitted successfully", newLeaveRecord });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ Function to get leave details of an employee
exports.getEmployeeLeaveDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // ✅ Fetch Employee Basic Details
    const employee = await Employee.findById(employeeId).select(
      "firstName lastName email phoneNo designation department"
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ✅ Fetch All Leave Records for the Employee (Sorted by Most Recent First)
    const leaveRecords = await Leave.find({ employee: employeeId })
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Initialize default remaining leave balances
    let leaveAvailable = {
      cl: { opBal: 12, add: 0, less: 0, clBal: 12 },
      ml: { opBal: 6, add: 0, less: 0, clBal: 6 },
      pl: { opBal: 12, add: 0, less: 0, clBal: 12 },
      total: { opBal: 30, add: 0, less: 0, clBal: 30 },
    };

    let leaveDetails = null; // ✅ New object to store latest leave details

    if (leaveRecords.length > 0) {
      const latestLeave = leaveRecords[0]; // ✅ Get the most recent leave record
      leaveAvailable = latestLeave.leaveAvailable;
      leaveDetails = latestLeave.leaveDetails; // ✅ Store latest leave details
    }

    // ✅ Prepare Response
    res.json({
      employeeDetails: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
        phoneNo: employee.phoneNo,
        designation: employee.designation,
        department: employee.department,
      },
      leaveAvailable, // ✅ Previously returned
      leaveDetails,   // ✅ NEW: Now frontend gets the latest leave request details
      leaveHistory: leaveRecords, // ✅ Returns full history
    });
  } catch (error) {
    console.error("Error fetching employee leave details:", error);
    res.status(500).json({ message: "Server error" });
  }
};





// ✅ Update Leave Status (Approve, Reject, or Pending)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leaveRecord = await Leave.findById(leaveId);
    if (!leaveRecord) {
      return res.status(404).json({ message: "Leave record not found" });
    }

    leaveRecord.status = status;
    await leaveRecord.save();

    res.status(200).json({ message: `Leave status updated to ${status}`, leaveRecord });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
