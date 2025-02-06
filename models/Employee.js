const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    Designation: { type: String, required: true },
    Department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    phoneNo: { type: String, required: true, unique: true },
    joiningDate: { type: String, required: true }, // ✅ Added joiningDate
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
