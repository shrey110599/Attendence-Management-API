const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, status, summary, members } = req.body;

    // Check if a project with the same name already exists
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res
        .status(400)
        .json({
          error: "Project name already exists. Please choose a different name.",
        });
    }

    const project = new Project({ name, status, summary, members });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};


// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("members", "firstName lastName email");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members", "firstName lastName email");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { name, status, summary, members } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, status, summary, members },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};


exports.getProjectsByEmployeeId = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const projects = await Project.find({ members: employeeId }).populate("members", "firstName lastName email");
  
      if (!projects.length) {
        return res
          .status(404)
          .json({ message: "No projects found for this employee." });
      }
  
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects for employee" });
    }
  };
  