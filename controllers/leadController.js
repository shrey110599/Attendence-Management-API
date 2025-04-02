const Lead = require("../models/leadModel");
const Employee = require("../models/Employee");

exports.createLead = async (req, res) => {
    try {
      const { assignedTo } = req.body;
  
      // ✅ Check if Employee Exists
      const employeeExists = await Employee.findById(assignedTo);
      if (!employeeExists) {
        return res.status(400).json({ message: "❌ Assigned employee does not exist" });
      }
  
      // ✅ Create Lead
      const lead = new Lead(req.body);
      await lead.save();
  
      res.status(201).json({ message: "✅ Lead created successfully", lead });
    } catch (error) {
      res.status(400).json({ message: "❌ Error creating lead", error: error.message });
    }
  };
// ✅ Get All Leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assignedTo", "name email");
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching leads", error });
  }
};

// ✅ Get Lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email");
    if (!lead) return res.status(404).json({ message: "❌ Lead not found" });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching lead", error });
  }
};

// ✅ Update Lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: "❌ Lead not found" });
    res.status(200).json({ message: "✅ Lead updated successfully", lead });
  } catch (error) {
    res.status(400).json({ message: "❌ Error updating lead", error });
  }
};

// ✅ Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "❌ Lead not found" });
    res.status(200).json({ message: "✅ Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting lead", error });
  }
};
