const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const projectRoutes = require("./routes/projectRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const taskRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();

// Initialize Express App
const app = express();
const server = createServer(app);

// ✅ Fix CORS for WebSockets
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ Allow frontend
    methods: ["GET", "POST"],
    credentials: true, // ✅ Allow cookies/auth headers
  },
});

// ✅ Fix CORS for API requests
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Use Routes
app.use("/auth", authRoutes);
app.use("/departments", departmentRoutes);
app.use("/employees", employeeRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/reminders", reminderRoutes);
app.use("/projects", projectRoutes);
app.use("/leaves", leaveRoutes);
app.use("/tasks", taskRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const Message = require("./models/Message");

const users = {}; // Track connected users

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Handle user joining
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    socket.join(userId); // ✅ Join room
    console.log(`✅ User ${userId} connected with Socket ID: ${socket.id}`);
  });

  // Listen for messages
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      // ✅ Emit to sender and receiver only
      io.to(receiver).emit("newMessage", { sender, receiver, message });
      io.to(sender).emit("newMessage", { sender, receiver, message });
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(users).find(
      (key) => users[key] === socket.id
    );
    if (disconnectedUser) {
      delete users[disconnectedUser];
    }
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
