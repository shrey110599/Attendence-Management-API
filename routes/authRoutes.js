  const express = require("express");
  const { registerUser, loginUser } = require("../controllers/authController");
  const {
    sendOtp,
    verifyOtp,
    resetPassword,
  } = require("../controllers/forgotPasswordController");

  const router = express.Router();

  router.post("/register", registerUser);
  router.post("/login", loginUser);
  router.post("/forgot-password", sendOtp);
  router.post("/verify-otp", verifyOtp);
  router.post("/reset-password", resetPassword);

  module.exports = router;
