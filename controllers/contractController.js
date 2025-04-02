const Contract = require("../models/Contract");

// ✅ Create Contract
exports.createContract = async (req, res) => {
  try {
    const {
      customer,
      project,
      subject,
      contractValue,
      contractType,
      startDate,
      endDate,
      description,
      contentInfo,
      comments,
      notes,
    } = req.body;
    const attachmentFiles = req.files ? req.files.map((file) => file.path) : [];

    if (!customer || !project || !subject || !contractValue || !contractType || !startDate) {
      return res.status(400).json({ message: "❌ Required fields missing" });
    }

    const contract = new Contract({
      customer,
      project,
      subject,
      contractValue,
      contractType,
      startDate,
      endDate,
      description,
      contentInfo: { description: contentInfo || "" }, // Treat contentInfo as a string directly
      attachmentInfo: { files: attachmentFiles },
      comments: comments ? JSON.parse(comments) : [],
      notes: notes ? JSON.parse(notes) : [],
    });

    await contract.save();
    res.status(201).json({ message: "✅ Contract created successfully", contract });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// 🔍 Get All Contracts
exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate("customer project");
    res.status(200).json({ contracts });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// 🔍 Get Single Contract by ID
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate("customer project");
    if (!contract) return res.status(404).json({ message: "❌ Contract not found" });
    res.status(200).json({ contract });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// 📝 Update Contract
exports.updateContract = async (req, res) => {
  try {
    const {
      customer,
      project,
      subject,
      contractValue,
      contractType,
      startDate,
      endDate,
      description,
      contentInfo,
      comments,
      notes,
    } = req.body;
    const attachmentFiles = req.files ? req.files.map((file) => file.path) : undefined;

    const updatedData = {
      customer,
      project,
      subject,
      contractValue,
      contractType,
      startDate,
      endDate,
      description,
      contentInfo: { description: contentInfo || "" }, // Treat contentInfo as a string directly
      comments: comments ? JSON.parse(comments) : [],
      notes: notes ? JSON.parse(notes) : [],
    };
    if (attachmentFiles) {
      updatedData.attachmentInfo = { files: attachmentFiles };
    }

    const contract = await Contract.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!contract) return res.status(404).json({ message: "❌ Contract not found" });

    res.status(200).json({ message: "✅ Contract updated successfully", contract });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// ❌ Delete Contract
exports.deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "❌ Contract not found" });
    res.status(200).json({ message: "✅ Contract deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};