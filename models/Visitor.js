const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    purpose: { type: String, required: true }, // Meeting, Interview, Delivery, etc.
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Must be a Reporting Officer
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    status: { type: String, enum: ["Checked In", "Checked Out"], default: "Checked In" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", VisitorSchema);
