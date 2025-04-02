const express = require("express");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const router = express.Router();

// ✅ Create Lead
router.post("/", createLead);

// ✅ Get All Leads
router.get("/", getLeads);

// ✅ Get Lead by ID
router.get("/:id", getLeadById);

// ✅ Update Lead
router.put("/:id", updateLead);

// ✅ Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;
