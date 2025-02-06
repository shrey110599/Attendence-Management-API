const Employee = require("../models/Employee");
const Department = require("../models/Department"); // ✅ Correct import
const mongoose = require("mongoose");
// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      email,
      Designation,
      Department: departmentId,
      phoneNo,
      joiningDate, // ✅ Added joiningDate
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Invalid Department ID" });
    }

    const departmentExists = await Department.findById(departmentId);
    if (!departmentExists) {
      return res.status(404).json({ message: "Department not found" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const employee = new Employee({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      email,
      Designation,
      Department: departmentId,
      phoneNo,
      joiningDate, // ✅ Added joiningDate
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("Department");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "Department"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    email,
    Designation,
    Department: departmentId, // Renamed to avoid conflicts
    phoneNo,
    joiningDate,
  } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (departmentId) {
      const departmentExists = await Department.findById(departmentId);
      if (!departmentExists) {
        return res.status(400).json({ message: "Invalid Department ID" });
      }
      employee.Department = departmentId; // Update department only if valid
    }

    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.gender = gender || employee.gender;
    employee.dateOfBirth = dateOfBirth || employee.dateOfBirth;
    employee.email = email || employee.email;
    employee.Designation = Designation || employee.Designation;
    employee.phoneNo = phoneNo || employee.phoneNo;
    employee.joiningDate = joiningDate || employee.joiningDate;

    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Use deleteOne() instead of remove()
    await Employee.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Employee removed successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
