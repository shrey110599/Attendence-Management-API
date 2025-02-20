const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");

const router = express.Router();

router.post("/send", sendMessage); 
router.get("/history/:sender/:receiver", getChatHistory);

module.exports = router;
