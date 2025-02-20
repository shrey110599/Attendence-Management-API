const Message = require("../models/Message");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch chat history between two employees
exports.getChatHistory = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    const messages = await Message.find({
      $or: [  
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .sort({ createdAt: 1 })
      .lean(); // Convert Mongoose documents to plain objects

    // Add `sentBy` field for frontend clarity
    const formattedMessages = messages.map((msg) => ({
      ...msg,
      sentBy: msg.sender.toString() === sender ? "me" : "them",
    }));

    res.status(200).json({ success: true, messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
