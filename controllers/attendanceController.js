// controllers/attendanceController.js
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Holiday = require("../models/Holiday");
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Check if today is a holiday
    const holiday = await Holiday.findOne({ date: today });
    if (holiday) {
      return res.json({ message: `Today is a holiday: ${holiday.name}`, status: "Holiday" });
    }

    // ✅ Check if attendance already exists
    const existingAttendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // ✅ Mark attendance as "Present"
    const attendance = new Attendance({
      employee: employeeId,
      date: today,
      checkInTime: new Date(),
      status: "Present",
    });

    await attendance.save();
    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/// ✅ Get employees who have marked attendance today (Present Employees)
exports.getPresentEmployees = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Check if today is a holiday
    const holiday = await Holiday.findOne({ date: today });
    if (holiday) {
      const employees = await Employee.find().select("firstName lastName email phoneNo Designation Department");
      return res.json(
        employees.map((emp) => ({
          employee: emp,
          status: "Holiday",
          message: `Today is a holiday: ${holiday.name}`,
        }))
      );
    }

    // ✅ Fetch employees who marked attendance today
    const presentEmployees = await Attendance.find({ date: today })
      .populate({
        path: "employee",
        select: "firstName lastName email phoneNo Designation Department",
        populate: { path: "Department", select: "name description" },
      })
      .select("employee checkInTime status");

    res.json(presentEmployees);
  } catch (error) {
    console.error("Error fetching present employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const autoMarkAbsent = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Check if today is a holiday
    const holiday = await Holiday.findOne({ date: today });
    if (holiday) {
      console.log(`✅ Skipping absence marking: Today is a holiday (${holiday.name})`);
      return;
    }

    // ✅ Get all employees
    const allEmployees = await Employee.find().select("_id");

    // ✅ Get employees who have already checked in
    const presentEmployees = await Attendance.find({ date: today }).select("employee");
    const presentEmployeeIds = presentEmployees.map((record) => record.employee.toString());

    // ✅ Find employees who haven't checked in
    const absentEmployees = allEmployees.filter((emp) => !presentEmployeeIds.includes(emp._id.toString()));

    // ✅ Mark absent employees
    for (let employee of absentEmployees) {
      await Attendance.create({
        employee: employee._id,
        date: today,
        status: "Absent",
      });
    }

    console.log(`✅ Auto-marked ${absentEmployees.length} employees as Absent`);
  } catch (error) {
    console.error("❌ Error auto-marking absent:", error);
  }
};

// ✅ Run every night at 11:59 PM
setInterval(async () => {
  const now = new Date();
  if (now.getHours() === 23 && now.getMinutes() === 59) {
    await autoMarkAbsent();
  }
}, 60000); 


const autoMarkHoliday = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Check if today is a holiday
    const holiday = await Holiday.findOne({ date: today });
    if (!holiday) return; // No holiday today, do nothing

    console.log(`✅ Today (${today.toDateString()}) is a holiday: ${holiday.name}`);

    // ✅ Get all employees
    const employees = await Employee.find().select("_id");

    // ✅ Check who already has attendance marked
    const existingRecords = await Attendance.find({ date: today }).select("employee");
    const markedEmployeeIds = existingRecords.map((record) => record.employee.toString());

    // ✅ Find employees who don't have an attendance record today
    const employeesToMark = employees.filter((emp) => !markedEmployeeIds.includes(emp._id.toString()));

    // ✅ Create holiday attendance records
    const holidayAttendances = employeesToMark.map((employee) => ({
      employee: employee._id,
      date: today,
      status: "Holiday",
    }));

    await Attendance.insertMany(holidayAttendances);
    console.log(`✅ Marked ${holidayAttendances.length} employees as "Holiday"`);
  } catch (error) {
    console.error("❌ Error auto-marking holidays:", error);
  }
};

// ✅ Run autoMarkHoliday at 12:00 AM every day
setInterval(async () => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    await autoMarkHoliday();
  }
}, 60000);


// ✅ Get attendance details of a specific employee
exports.getEmployeeAttendanceDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    // Fetch attendance records (including Absent)
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

    if (!attendanceRecords.length) {
      return res.json([{ status: "Absent", message: "No records found" }]);
    }

    // ✅ Calculate working hours & adjust status
    const formattedRecords = attendanceRecords.map((record) => {
      let workingHours = null;
      let updatedStatus = record.status;

      if (record.checkInTime && record.checkOutTime) {
        workingHours =
          (new Date(record.checkOutTime) - new Date(record.checkInTime)) /
          (1000 * 60 * 60);

        if (workingHours < 9) {
          updatedStatus = "Half Day";
        }
      }

      return {
        ...record._doc,
        workingHours: workingHours ? workingHours.toFixed(2) + " hours" : "N/A",
        status: updatedStatus,
      };
    });

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
    console.log("📢 Checkout request received:", req.body); // Debug log

    const { employeeId } = req.body;

    if (!employeeId) {
      console.error("❌ Error: Employee ID is missing");
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // ✅ Validate employeeId format (MongoDB ObjectID check)
    if (!employeeId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("❌ Error: Invalid Employee ID format");
      return res.status(400).json({ message: "Invalid Employee ID format" });
    }

    // ✅ Ensure `getToday()` is working
    const today = getToday();
    if (!today) {
      console.error("❌ Error: getToday() function failed");
      return res
        .status(500)
        .json({ message: "Server error: Invalid date function" });
    }

    console.log("🔍 Searching for attendance record...");

    // ✅ Find today's attendance record
    const attendanceRecord = await Attendance.findOne({
      employee: employeeId,
      date: today,
      checkOutTime: null,
    });

    if (!attendanceRecord) {
      console.warn("⚠️ Warning: Employee not found in checkout list");
      return res.status(404).json({
        message: "Employee not found in checkout list or already checked out",
      });
    }

    console.log("✅ Attendance record found:", attendanceRecord);

    if (!attendanceRecord.checkInTime) {
      console.error("❌ Error: Check-in time is missing");
      return res.status(400).json({
        message: "Check-in time is missing, cannot process checkout",
      });
    }

    // ✅ Set checkOutTime to current time
    attendanceRecord.checkOutTime = new Date();

    // ✅ Calculate working hours
    const checkIn = new Date(attendanceRecord.checkInTime);
    const checkOut = new Date(attendanceRecord.checkOutTime);
    const workingHours = ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours

    // ✅ Ensure workingHours is a valid number
    if (isNaN(workingHours)) {
      console.error("❌ Error: Working hours calculation failed");
      return res
        .status(500)
        .json({ message: "Server error: Invalid working hours calculation" });
    }

    attendanceRecord.workingHours = `${workingHours} hours`;

    // ✅ Update status based on working hours
    attendanceRecord.status = workingHours < 9 ? "Half Day" : "Present";

    console.log("💾 Saving updated attendance record...");
    await attendanceRecord.save();
    console.log("✅ Checkout successful, data saved.");

    // ✅ Return response with updated attendance details
    res.status(200).json({
      message: "Checkout successful",
      checkoutCompleted: true,
      attendance: {
        employee: attendanceRecord.employee,
        date: attendanceRecord.date,
        checkInTime: attendanceRecord.checkInTime,
        checkOutTime: attendanceRecord.checkOutTime,
        status: attendanceRecord.status,
        workingHours: attendanceRecord.workingHours,
      },
    });
  } catch (error) {
    console.error("🚨 Server Error during checkout:", error);

    res.status(500).json({
      message: "Server error: Unable to complete checkout",
      error: error.message,
    });
  }
};

// ✅ Get employees who have NOT checked in today (Absent Employees)
exports.getAbsentEmployees = async (req, res) => {
  try {
    const today = getToday();

    const presentEmployees = await Attendance.find({ date: today }).select(
      "employee"
    );
    const presentEmployeeIds = presentEmployees.map((record) =>
      record.employee.toString()
    );

    const absentEmployees = await Employee.find({
      _id: { $nin: presentEmployeeIds },
    });

    res.json(absentEmployees);
  } catch (error) {
    console.error("Error fetching absent employees", error);
    res.status(500).json({ message: "Server error" });
  }
};
