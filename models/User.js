const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: null }, // Allow null password
  role: { type: String, enum: ["admin", "employee", "reporting officer"], required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: function () {
      return this.role === "reporting officer"; // Department is required ONLY for reporting officers
    },
  },
});

module.exports = mongoose.model("User", userSchema);
