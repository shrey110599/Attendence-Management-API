const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  year: { type: Number, required: true },
  month: { type: Number, required: true },

  employmentDetails: {
    employeeName: { type: String, required: true },
    dateOfApplication: { type: Date, required: true },
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    projectName: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // ✅ Referenced from "Project"
    reportingTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Referenced from "User"
    postingLocation: { type: String },
    postedSince: { type: Date },
  },

  leaveDetails: {
    leaveRequested: { type: String, required: true },
    natureOfLeave: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveBalance", // ✅ Proper reference to LeaveBalance
      required: true,
    },
    reasonOfLeave: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    emergencyContact: { type: Boolean, required: true },
  },

  leaveAvailable: {
    cl: {
      opBal: { type: Number, default: 12 },
      add: { type: Number, default: 0 },
      less: { type: Number, default: 0 },
      clBal: { type: Number, default: 12 },
    },
    ml: {
      opBal: { type: Number, default: 6 },
      add: { type: Number, default: 0 },
      less: { type: Number, default: 0 },
      clBal: { type: Number, default: 6 },
    },
    pl: {
      opBal: { type: Number, default: 12 },
      add: { type: Number, default: 0 },
      less: { type: Number, default: 0 },
      clBal: { type: Number, default: 12 },
    },
    total: {
      opBal: { type: Number, default: 30 }, // ✅ Total = CL + ML + PL
      add: { type: Number, default: 0 },
      less: { type: Number, default: 0 },
      clBal: { type: Number, default: 30 },
    },
  },

  signatureDates: {
    employee: { type: Date },
    hod: { type: Date },
    finalEmployee: { type: Date },
    finalHod: { type: Date },
  },

  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
