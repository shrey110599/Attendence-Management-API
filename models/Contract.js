const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // References Customer Table
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // References Project Table
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    contractValue: {
      type: Number,
      required: true,
    },
    contractType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    contentInfo: {
      description: {
        type: String,
        trim: true,
      },
    },
    attachmentInfo: {
      files: [String], // Stores file paths (PDFs/Images)
    },
    comments: [
      {
        description: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    notes: [
      {
        description: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", ContractSchema);
