const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true, // Ensure no duplicate holidays
    },
    description: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Holiday", HolidaySchema);
