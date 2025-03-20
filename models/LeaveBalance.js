const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema(
  {
    leaveName: { type: String, required: true, unique: true }, // e.g., PL, CL, ML
    description: { type: String, required: true },             // e.g., Paid Leave
    maxDaysAllowed: { type: Number, required: true },          // e.g., 12, 6
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveBalance", leaveBalanceSchema);
// Compare this snippet from models/LeaveBalance.js: