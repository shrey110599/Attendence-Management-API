// controllers/attendanceController.js
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// Helper: Get today's date at midnight
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Get employees who have NOT marked attendance today
exports.getAvailableEmployees = async (req, res) => {
    try {
      const today = getToday();

      // Get employees who have already marked attendance
      const attendanceRecords = await Attendance.find({ date: today }).select(
        "employee"
      );
      const presentEmployeeIds = attendanceRecords.map((record) =>
        record.employee.toString()
      );

      // Get employees who have NOT marked attendance today and populate Department details
      const availableEmployees = await Employee.find({
        _id: { $nin: presentEmployeeIds },
      }).populate("Department", "name description createdAt updatedAt"); // Fetch department details

      res.json(availableEmployees);
    } catch (error) {
      console.error("Error fetching available employees", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  
// Mark attendance for an employee
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const today = getToday();

    // Check if attendance already exists for this employee today
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });
    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for today" });
    }

    // Save attendance record with check-in time
    const attendance = new Attendance({
      employee: employeeId,
      date: today,
      checkInTime: new Date(), // Store the current timestamp
    });
    await attendance.save();

    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Error marking attendance", error);
    res.status(500).json({ message: "Server error" });
  }
};
  
// Get employees who have marked attendance today
exports.getPresentEmployees = async (req, res) => {
    try {
      // Get the date from query parameter or default to today's date
      const date = req.query.date || getToday(); // Use the provided date or today's date

      // Get attendance records for the given date and populate employee + department details
      const presentEmployees = await Attendance.find({ date })
        .populate({
          path: "employee",
          select: "firstName lastName email phoneNo Designation Department",
          populate: {
            path: "Department",
            select: "name description", // Fetch department name and description
          },
        })
        .select("employee checkInTime");

      res.json(presentEmployees);
    } catch (error) {
      console.error("Error fetching present employees", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  exports.getEmployeeAttendanceDetails = async (req, res) => {
    try {
      const { employeeId } = req.params;
      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      // Fetch all attendance records of the given employee
      const attendanceRecords = await Attendance.find({ employee: employeeId })
        .populate({
          path: "employee",
          select: "firstName lastName email phoneNo Designation Department",
          populate: {
            path: "Department",
            select: "name description",
          },
        })
        .select("date checkInTime checkOutTime");

      if (!attendanceRecords.length) {
        return res
          .status(404)
          .json({ message: "No attendance records found for this employee" });
      }

      res.json(attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance details", error);
      res.status(500).json({ message: "Server error" });
    }
  };