// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to Database
connectDB();

// ✅ Initialize Express App
const app = express();
const server = createServer(app);

// ✅ Allowed Frontend Origins for CORS & WebSockets
const allowedOrigins = [
  "http://localhost:5173",
  "https://aarkinfosoft.netlify.app",
];

// ✅ Configure WebSocket Server with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // ✅ Allow both frontend URLs
    methods: ["GET", "POST"],
    credentials: true, // ✅ Allow cookies/auth headers
  },
});

// ✅ Configure CORS Middleware for API Requests
app.use(
  cors({
    origin: allowedOrigins, // ✅ Allow both frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allow authentication headers
  })
);

// ✅ Middleware to parse JSON request body
app.use(express.json());

/*  
|--------------------------------------------------------------------------
| ✅ Define API Routes  
|--------------------------------------------------------------------------
| These routes handle different functionalities of the application.
| Each route is responsible for managing a specific module.
|
| Example: "/auth" handles authentication, "/projects" manages projects, etc.
|--------------------------------------------------------------------------
*/

// ✅ Authentication Routes (Login, Register, etc.)
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// ✅ Department Management Routes
const departmentRoutes = require("./routes/departmentRoutes");
app.use("/departments", departmentRoutes);

// ✅ Employee Management Routes
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/employees", employeeRoutes);

// ✅ Attendance Management Routes
const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/attendance", attendanceRoutes);

// ✅ User Management Routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// ✅ Admin Panel Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

// ✅ Reminder Management Routes
const reminderRoutes = require("./routes/reminderRoutes");
app.use("/reminders", reminderRoutes);

// ✅ Project Management Routes
const projectRoutes = require("./routes/projectRoutes");
app.use("/projects", projectRoutes);


// ✅ Leave Management Routes
app.use("/leaves", require("./routes/leaveRoutes"));

// ✅ Task Management Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);

// ✅ Real-Time Chat Routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes); 

// ✅ File Download Routes
const downloadRoutes = require("./routes/downloadRoutes");
app.use("/download", downloadRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

/*  
|--------------------------------------------------------------------------
| ✅ Real-Time WebSocket Implementation  
|--------------------------------------------------------------------------
| The WebSocket server allows real-time communication between users.
| It manages user connections, message sending, and disconnections.
|--------------------------------------------------------------------------
*/

// ✅ Import Message Model (for storing chat messages)
const Message = require("./models/Message");

// ✅ Track connected users
const users = {};

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // ✅ Handle user joining the chat
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    socket.join(userId); // ✅ Add user to a personal room
    console.log(`✅ User ${userId} connected with Socket ID: ${socket.id}`);
  });

  // ✅ Handle sending messages
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      // ✅ Emit message to sender and receiver only
      io.to(receiver).emit("newMessage", { sender, receiver, message });
      io.to(sender).emit("newMessage", { sender, receiver, message });
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });

  // ✅ Handle user disconnection
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

/*  
|--------------------------------------------------------------------------
| ✅ Start Server  
|--------------------------------------------------------------------------
| The server listens on a specified port (from .env or default 5000).
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
