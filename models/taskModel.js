const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, 
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    priority: { type: String, enum: ["High", "Medium", "Low"], required: true, default: "Medium" }, // 🆕 Added Priority Field
    dueDate: { type: Date, required: true },
    expectedHours: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
