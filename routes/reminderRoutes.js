const express = require('express');
const router = express.Router();
const { 
  createReminder, 
  getReminders, 
  updateReminder, 
  deleteReminder 
} = require('../controllers/reminderController');

// Create Reminder (For all employees or a specific employee)
router.post('/create', createReminder);

// Get Reminders (For all employees or a specific employee)
router.get('/:employeeId?', getReminders);

// Update Reminder
router.put('/:id', updateReminder);

// Delete Reminder
router.delete('/:id', deleteReminder);

module.exports = router;
