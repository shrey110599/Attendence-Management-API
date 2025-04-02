const express = require("express");
const { registerVisitor, getVisitors, updateVisitor, checkOutVisitor } = require("../controllers/visitorController");

const router = express.Router();

// ✅ Register a new visitor
router.post("/register", registerVisitor);

// ✅ Get all visitors
router.get("/", getVisitors);

// ✅ Update visitor details before checkout
router.put("/update/:id", updateVisitor);

// ✅ Mark visitor as checked out
router.put("/checkout/:id", checkOutVisitor);

module.exports = router;
