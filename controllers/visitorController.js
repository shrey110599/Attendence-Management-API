const Visitor = require("../models/Visitor");
const User = require("../models/User");
const { sendNotificationEmails } = require("../utils/emailUtils");


// ✅ Register a new visitor (Only "Reporting Officers" can be hosts)
exports.registerVisitor = async (req, res) => {
  try {
    const { host, name, email, purpose } = req.body;

    // Check if the host exists in the User model
    const hostUser = await User.findById(host);
    if (!hostUser) {
      return res
        .status(404)
        .json({ success: false, message: "Host user not found" });
    }

    // Normalize the role check (case-insensitive)
    if (hostUser.role.toLowerCase() !== "reporting officer") {
      return res.status(403).json({
        success: false,
        message: "Only Reporting Officers can be hosts",
      });
    }

    // Ensure the Reporting Officer has a department assigned
    if (!hostUser.department) {
      return res.status(400).json({
        success: false,
        message: "Reporting Officer must belong to a department",
      });
    }

    // Save the visitor entry
    const newVisitor = new Visitor(req.body);
    await newVisitor.save();

    // Send email notifications to host and visitor
    await sendNotificationEmails({
      hostEmail: hostUser.email,
      hostName: hostUser.name,
      visitorEmail: email,
      visitorName: name,
      purpose,
    });

    res.status(201).json({
      success: true,
      message: "Visitor registered successfully",
      visitor: newVisitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get all visitors
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate("host", "name email"); // Populate host details
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Visitor Details Before Checkout
exports.updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVisitor = await Visitor.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedVisitor) {
      return res
        .status(404)
        .json({ success: false, message: "Visitor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Visitor details updated",
      visitor: updatedVisitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Check out a visitor
exports.checkOutVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find visitor
    const visitor = await Visitor.findById(id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    // ✅ Update checkout time & status
    visitor.checkOutTime = new Date();
    visitor.status = "Checked Out";
    await visitor.save();

    res.status(200).json({ success: true, message: "Visitor checked out successfully", visitor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
