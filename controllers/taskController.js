const Task = require("../models/taskModel");
const Project = require("../models/Project");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, dueDate, expectedHours } =
      req.body;

    if (!expectedHours || expectedHours <= 0) {
      return res
        .status(400)
        .json({ message: "Expected hours must be greater than 0." });
    }

    // Validate if Project Exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      project,
      dueDate,
      expectedHours,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "firstName lastName")
      .populate("project", "name status");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "firstName lastName")
      .populate("project", "name status");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { expectedHours } = req.body;

    if (expectedHours !== undefined && expectedHours <= 0) {
      return res
        .status(400)
        .json({ message: "Expected hours must be greater than 0." });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTasksByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Fetch tasks and populate project name
    const tasks = await Task.find({ assignedTo: employeeId })
      .populate("project", "name");

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this employee." });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
  