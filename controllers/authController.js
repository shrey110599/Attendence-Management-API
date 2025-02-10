const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const ActivityLog = require("../models/ActivityLog.js");

// Register User with Activity Logging
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (role === 'admin') {
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists' });
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        if (user) {
            // Log the registration activity
            await ActivityLog.create({ userId: user._id, action: "register" });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
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
