const User = require("../models/User");
const Department = require("../models/Department.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const ActivityLog = require("../models/ActivityLog.js");
const mongoose = require("mongoose");


// Register User with Activity Logging
const registerUser = async (req, res) => {
  const { name, email, password, role, department } = req.body; // Accept department in request

  try {
    // Restrict multiple admins
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
    }

    // Validate department only if the role is "reporting officer"
    if (role === "reporting officer") {
      if (!department) {
        return res.status(400).json({ message: "Department is required for Reporting Officers" });
      }

      // Check if department ID is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({ message: "Invalid department ID format" });
      }

      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(400).json({ message: "Department not found" });
      }
    }

    // Check if user with the same email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: role === "reporting officer" ? department : undefined, // Assign department only for reporting officers
    });

    if (user) {
      // Log activity, but check if ActivityLog model exists
      if (typeof ActivityLog !== "undefined") {
        await ActivityLog.create({ userId: user._id, action: "register" });
      } else {
        console.warn("ActivityLog model not found. Skipping activity logging.");
      }

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};




// Login User with Activity Logging
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Log the login activity
      await ActivityLog.create({ userId: user._id, action: "login" });

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
