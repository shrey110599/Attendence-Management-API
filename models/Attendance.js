// models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true, default: () => new Date().setHours(0, 0, 0, 0) },
  checkInTime: { type: Date, default: Date.now } // Store the exact check-in time
});

// Ensure an employee can only mark attendance once per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
