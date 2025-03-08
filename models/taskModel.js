const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, 
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date, required: true },
    expectedHours: { type: Number, required: true }, // 🆕 New Field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
