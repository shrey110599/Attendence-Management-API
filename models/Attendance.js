const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: function () {
        return this.status !== "Holiday"; // Employee is required unless it's a holiday
      },
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date().setHours(0, 0, 0, 0),
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Holiday"], // ✅ Added "Holiday" status
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Unique index for attendance per employee per day (excluding holidays)
AttendanceSchema.index(
  { employee: 1, date: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "Holiday" } } }
);

// ✅ Unique index for holiday attendance (ensures only one holiday record per day)
AttendanceSchema.index(
  { date: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "Holiday" } }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
