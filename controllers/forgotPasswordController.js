const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// 1️⃣ Send OTP to Email
const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Delete any existing OTP for this email
    await Otp.deleteMany({ email });

    // ✅ Save OTP in DB with expiry (5 minutes)
    await Otp.create({ email, otp: otpCode, createdAt: new Date() });

    // ✅ Debugging: Log OTP before sending email
    console.log(`Generated OTP: ${otpCode} for ${email}`);

    // ✅ Send Email with OTP
    await sendEmail({
      to: email,
      subject: "Aark Infosoft - Password Reset OTP",
      emailType: "password_reset",
      data: { otp: otpCode },
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// 2️⃣ Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });

    // OTP is valid, proceed
    res.json({ message: "OTP verified, you can reset your password" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP from DB
    await Otp.deleteOne({ email });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendOtp, verifyOtp, resetPassword };

// 4️⃣ Resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found.." });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email });

    // Save OTP in DB with expiry (e.g., 5 minutes)
    await Otp.create({ email, otp: otpCode, createdAt: new Date() });

    // Debugging: Log OTP before sending email
    console.log(`Generated OTP: ${otpCode} for ${email}`);

    // Send Email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otpCode}`);

    res.json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, resetPassword, resendOtp };
