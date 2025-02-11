const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  message: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null }, // Null means notify all
  forAll: { type: Boolean, default: false }, // If true, notify all employees
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);
