const Holiday = require("../models/Holiday");

// ✅ Create a new holiday
exports.addHoliday = async (req, res) => {
  try {
    const { name, date, description } = req.body;

    // Ensure date is unique
    const existingHoliday = await Holiday.findOne({ date });
    if (existingHoliday) {
      return res.status(400).json({ message: "Holiday already exists on this date." });
    }

    const newHoliday = new Holiday({ name, date, description });
    await newHoliday.save();

    res.status(201).json({ message: "Holiday added successfully", holiday: newHoliday });
  } catch (error) {
    console.error("Error adding holiday:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all holidays
exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 }); // Sort by date ascending
    res.json(holidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a single holiday by ID
exports.getHolidayById = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findById(id);
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });

    res.json(holiday);
  } catch (error) {
    console.error("Error fetching holiday:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update a holiday by ID
exports.updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id); // Debugging

    const { name, date, description } = req.body;
    console.log("Received Data:", req.body); // Debugging

    if (!name || !date || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure id is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid holiday ID" });
    }

    const updatedHoliday = await Holiday.findByIdAndUpdate(
      id,
      { name, date: new Date(date), description }, // Ensure date is stored correctly
      { new: true, runValidators: true }
    );

    if (!updatedHoliday) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    res.json({
      message: "Holiday updated successfully",
      holiday: updatedHoliday,
    });
  } catch (error) {
    console.error("Error updating holiday:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a holiday by ID
exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByIdAndDelete(id);
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });

    res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    res.status(500).json({ message: "Server error" });
  }
};
