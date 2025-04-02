const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal_sent"],
      required: [true, "Status is required"],
    },
    source: {
      type: String,
      enum: ["Facebook", "Google", "Other"],
      required: [true, "Source is required"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Assigned employee is required"],
    },
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[1-9]\d{1,14}$/],
    },
    leadValue: {
      type: Number,
      required: [true, "Lead value is required"],
      min: 1,
    },
    company: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: {
      type: String,
      match: [/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"],
    },
    defaultLanguage: { type: String, trim: true },
    description: { type: String, trim: true },
    publicContactedToday: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
