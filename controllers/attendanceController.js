// controllers/attendanceController.js
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

// ✅ Helper function: Get today's date at midnight
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// ✅ Get employees who have NOT marked attendance today (Absent Employees)
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

// ✅ Mark attendance for an employee (Check-in)
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    const today = getToday();

    const existingAttendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (existingAttendance) return res.status(400).json({ message: "Attendance already marked" });

    const attendance = new Attendance({
      employee: employeeId,
      date: today,
      checkInTime: new Date(),
      status: "Present", // Default to Present (will update on checkout)
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Error marking attendance", error);
    res.status(500).json({ message: "Server error" });
  }
};



/// ✅ Get employees who have marked attendance today (Present Employees)
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

// ✅ Get attendance details of a specific employee
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
      .select("date checkInTime checkOutTime status");

    // ✅ Calculate working hours for each record
    const formattedRecords = attendanceRecords.map(record => {
      let workingHours = null;
      if (record.checkInTime && record.checkOutTime) {
        workingHours = (new Date(record.checkOutTime) - new Date(record.checkInTime)) / (1000 * 60 * 60);
      }
      return {
        ...record._doc,
        workingHours: workingHours ? workingHours.toFixed(2) + " hours" : "N/A",
      };
    });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found for this employee" });
    }

    res.json(formattedRecords);
  } catch (error) {
    console.error("Error fetching attendance details", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get employees eligible for checkout (who haven't checked out yet)
exports.getCheckoutEmployees = async (req, res) => {
  try {
    const today = getToday();

    const checkoutList = await Attendance.find({
      date: today,
      checkOutTime: null, // Only fetch employees who haven't checked out
    })
      .populate({
        path: "employee",
        select: "firstName lastName email phoneNo Designation Department",
        populate: {
          path: "Department",
          select: "name description",
        },
      })
      .select("employee checkInTime");

    res.json(checkoutList);
  } catch (error) {
    console.error("Error fetching checkout list", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Checkout an employee and update status 
exports.checkoutEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const today = getToday();

    // Find today's attendance record where checkOutTime is null
    const attendanceRecord = await Attendance.findOne({
      employee: employeeId,
      date: today,
      checkOutTime: null,
    });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ message: "Employee not found in checkout list" });
    }

    // ✅ Update checkOutTime to the current time
    attendanceRecord.checkOutTime = new Date();

    // ✅ Calculate working hours
    const checkIn = new Date(attendanceRecord.checkInTime);
    const checkOut = new Date(attendanceRecord.checkOutTime);
    const workingHours = (checkOut - checkIn) / (1000 * 60 * 60); // Convert ms to hours

    // ✅ Update status based on working hours
    attendanceRecord.status =
      workingHours < 9 ? "Present + Half Day" : "Present";

    await attendanceRecord.save();

    res.status(200).json({
      message: "Checkout successful",
      checkoutCompleted: true, // ✅ Unique flag to hide button in frontend
      attendance: {
        employee: attendanceRecord.employee,
        date: attendanceRecord.date,
        checkInTime: attendanceRecord.checkInTime,
        checkOutTime: attendanceRecord.checkOutTime, // Updated checkout time
        status: attendanceRecord.status, // Updated status
        workingHours: workingHours.toFixed(2) + " hours", // Include calculated hours
      },
    });
  } catch (error) {
    console.error("Error during checkout", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get employees who have NOT checked in today (Absent Employees)
exports.getAbsentEmployees = async (req, res) => {
  try {
    const today = getToday();

    const presentEmployees = await Attendance.find({ date: today }).select("employee");
    const presentEmployeeIds = presentEmployees.map(record => record.employee.toString());

    const absentEmployees = await Employee.find({ _id: { $nin: presentEmployeeIds } });

    res.json(absentEmployees);
  } catch (error) {
    console.error("Error fetching absent employees", error);
    res.status(500).json({ message: "Server error" });
  }
};
