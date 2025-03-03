const Leave = require("../models/Leave");
const moment = require("moment");
const Employee = require("../models/Employee");


// ✅ Apply Leave with Annual Leave Allocation
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, employmentDetails, leaveDetails } = req.body;

    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    const from = moment(leaveDetails.fromDate);
    const to = moment(leaveDetails.toDate);
    const days = to.diff(from, "days") + 1;

    const year = from.year();
    const month = from.month() + 1;

    let leaveRecord = await Leave.findOne({ employee: employeeId, year });

    if (!leaveRecord) {
      // ✅ If no record exists for the year, create a new record with default leave balance
      leaveRecord = new Leave({
        employee: employeeId,
        year,
        month,
        employmentDetails,
        leaveDetails,
        status: "Pending",
        leaveAvailable: {
          cl: { opBal: 12, clBal: 12 },
          ml: { opBal: 6, clBal: 6 },
          pl: { opBal: 12, clBal: 12 },
          total: { opBal: 30, clBal: 30 },
        },
      });
    }

    // ✅ Deduct leave from the correct category
    if (leaveDetails.natureOfLeave === "Paid") {
      if (leaveRecord.leaveAvailable.pl.clBal < days) {
        return res.status(400).json({ message: "Not enough Paid Leave available" });
      }
      leaveRecord.leaveAvailable.pl.less += days;
      leaveRecord.leaveAvailable.pl.clBal -= days;
    } else if (leaveDetails.natureOfLeave === "Medical") {
      if (leaveRecord.leaveAvailable.ml.clBal < days) {
        return res.status(400).json({ message: "Not enough Medical Leave available" });
      }
      leaveRecord.leaveAvailable.ml.less += days;
      leaveRecord.leaveAvailable.ml.clBal -= days;
    } else if (leaveDetails.natureOfLeave === "Casual") {
      if (leaveRecord.leaveAvailable.cl.clBal < days) {
        return res.status(400).json({ message: "Not enough Casual Leave available" });
      }
      leaveRecord.leaveAvailable.cl.less += days;
      leaveRecord.leaveAvailable.cl.clBal -= days;
    }

    // ✅ Update Total Leave Balance
    leaveRecord.leaveAvailable.total.less += days;
    leaveRecord.leaveAvailable.total.clBal =
      leaveRecord.leaveAvailable.cl.clBal +
      leaveRecord.leaveAvailable.ml.clBal +
      leaveRecord.leaveAvailable.pl.clBal;

    await leaveRecord.save();
    res.status(201).json({ message: "Leave request submitted successfully", leaveRecord });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Employee Leave Details
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

    // ✅ Get Current Year
    const currentYear = moment().year();

    // ✅ Check if Leave Record Exists for the Current Year
    let leaveRecord = await Leave.findOne({
      employee: employeeId,
      year: currentYear,
    });

    // ✅ If no leave record exists for the year, create a new one with default annual leave balance
    if (!leaveRecord) {
      leaveRecord = new Leave({
        employee: employeeId,
        year: currentYear,
        month: 1, // Default to January (New Year Start)
        leaveAvailable: {
          cl: { opBal: 12, clBal: 12 },
          ml: { opBal: 6, clBal: 6 },
          pl: { opBal: 12, clBal: 12 },
          total: { opBal: 30, clBal: 30 },
        },
      });

      await leaveRecord.save();
    }

    // ✅ Fetch All Leave Records for the Employee
    const leaveRecords = await Leave.find({ employee: employeeId })
      .sort({ year: -1 })
      .lean();

    // ✅ Extract Remaining Leaves
    const remainingLeaves = {
      cl: leaveRecord.leaveAvailable.cl.clBal,
      ml: leaveRecord.leaveAvailable.ml.clBal,
      pl: leaveRecord.leaveAvailable.pl.clBal,
      total: leaveRecord.leaveAvailable.total.clBal,
    };

    // ✅ Prepare Response
    const responseData = {
      employeeDetails: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
        phoneNo: employee.phoneNo,
        designation: employee.designation,
        department: employee.department,
      },
      remainingLeaves,
      leaveRecords, // ✅ Includes all leave applications
    };

    res.json(responseData);
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
