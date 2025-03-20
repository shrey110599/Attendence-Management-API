const express = require("express");
const {
  addHoliday,
  getAllHolidays,
  getHolidayById,
  deleteHoliday,
  updateHoliday,
} = require("../controllers/holidayController");

const router = express.Router();

// ✅ Create a new holiday
router.post("/", addHoliday);

// ✅ Get all holidaysd
router.get("/", getAllHolidays);

// ✅ Get a single holiday by ID
router.get("/:id", getHolidayById);

// ✅ Update a holiday
router.put("/:id", updateHoliday);

// ✅ Delete a holiday
router.delete("/:id", deleteHoliday);

module.exports = router;
