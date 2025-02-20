const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date().setHours(0, 0, 0, 0), // Always store date at 00:00:00
    },
    checkInTime: {
      type: Date,
      default: null, // Initially null, set when employee checks in
    },
    checkOutTime: {
      type: Date,
      default: null, // Initially null, updated when employee checks out
    },
    status: { type: String, enum: ["Present", "Absent","Half Day"], default: "Absent" },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

// ✅ Ensure an employee can check in only once per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
