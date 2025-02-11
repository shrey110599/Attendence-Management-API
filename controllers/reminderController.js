const Reminder = require('../models/Reminder');

// Send Reminder (For All Employees or Specific Employee)
exports.createReminder = async (req, res) => {
  try {
    const { message, employeeId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reminder = new Reminder({
      message,
      employeeId: employeeId || null, // Null means all employees
      forAll: !employeeId, // If no ID, mark as global notification
    });

    await reminder.save();
    res.status(201).json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Reminders (All Global or Specific Employee)
exports.getReminders = async (req, res) => {
  try {
    const { employeeId } = req.params;

    let reminders = employeeId 
      ? await Reminder.find({ $or: [{ employeeId }, { forAll: true }] }) 
      : await Reminder.find({ forAll: true });

    res.status(200).json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required for update" });
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.status(200).json({ success: true, updatedReminder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReminder = await Reminder.findByIdAndDelete(id);

    if (!deletedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
