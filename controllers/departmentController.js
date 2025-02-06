const Department = require('../models/Department');
const mongoose = require('mongoose');

// Create a new department
const createDepartment = async (req, res) => {
    const { name, description } = req.body;

    try {
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        return res.status(400).json({ message: "Department already exists" });
      }

      const department = new Department({ name, description });
      await department.save();

      res.status(201).json(department);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

// Get all departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update department by ID
const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        department.name = name || department.name;
        department.description = description || department.description;
        await department.save();

        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.deleteOne();
    res.status(200).json({ message: "Department removed successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
