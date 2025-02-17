const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/taskModel");

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ message: "Access denied" });

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is the assigned employee or an admin
const verifyTaskOwnerOrAdmin = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Allow if the user is an admin or the assigned employee
    if (req.user.role === "admin" || req.user._id.toString() === task.assignedTo.toString()) {
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You are not allowed to update this task.",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { protect, verifyAdmin, verifyTaskOwnerOrAdmin };
