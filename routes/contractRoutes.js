const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const upload = require("../middleware/upload");

// 📌 Create Contract (with File Upload)
router.post("/", upload.array("attachments", 5), contractController.createContract);

// 📌 Get All Contracts
router.get("/", contractController.getAllContracts);

// 📌 Get Contract by ID
router.get("/:id", contractController.getContractById);

// 📌 Update Contract (with File Upload)
router.put("/:id", upload.array("attachments", 5), contractController.updateContract);

// 📌 Delete Contract
router.delete("/:id", contractController.deleteContract);

module.exports = router;
