const express = require("express");
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  getProjectsByEmployeeId // New Function
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/employee/:employeeId", getProjectsByEmployeeId); // New Route
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
