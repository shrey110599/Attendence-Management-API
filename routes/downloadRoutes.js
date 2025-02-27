const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver"); // ✅ For creating a ZIP file
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Attendance = require("../models/Attendance");
const Project = require("../models/Project");
const Leave = require("../models/Leave");
const Task = require("../models/taskModel");
const Message = require("../models/Message");

const router = express.Router();

router.get("/download-data", async (req, res) => {
  try {
    // 📅 Get Current Date in YYYY-MM-DD Format
    const currentDate = new Date().toISOString().split("T")[0];
    const zipFileName = `Aark Infosoft - ${currentDate}.zip`;

    // Fetch all data
    const collections = {
      employees: await Employee.find({}),
      departments: await Department.find({}),
      attendance: await Attendance.find({}),
      projects: await Project.find({}),
      leaves: await Leave.find({}),
      tasks: await Task.find({}),
      messages: await Message.find({}),
    };

    const exportDir = path.join(__dirname, "../data");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // ✅ Save each collection as a separate JSON file
    for (const [name, data] of Object.entries(collections)) {
      fs.writeFileSync(
        path.join(exportDir, `${name}.json`),
        JSON.stringify(data, null, 2)
      );
    }

    // ✅ Create a ZIP file with custom name
    const zipFilePath = path.join(__dirname, `../data/${zipFileName}`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip");

    archive.pipe(output);
    archive.directory(exportDir, false);
    archive.finalize();

    output.on("close", () => {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${zipFileName}"`
      );
      res.setHeader("Content-Type", "application/zip");
      res.sendFile(zipFilePath);
    });
  } catch (error) {
    console.error("🚨 Error exporting data:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
