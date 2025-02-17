const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: null }, // Allow null password
  role: { type: String, enum: ["admin", "employee"], required: true },
});

module.exports = mongoose.model("User", userSchema);
