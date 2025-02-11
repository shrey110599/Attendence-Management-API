const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
  summary: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
