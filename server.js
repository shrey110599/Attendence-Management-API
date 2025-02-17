  const express = require("express");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const connectDB = require("./config/db");

  const authRoutes = require("./routes/authRoutes");
  const departmentRoutes = require("./routes/departmentRoutes");
  const employeeRoutes = require("./routes/employeeRoutes");
  const attendanceRoutes = require("./routes/attendanceRoutes");
  const adminRoutes = require("./routes/adminRoutes");
  const userRoutes = require("./routes/userRoutes");
  const reminderRoutes = require("./routes/reminderRoutes");
  const projectRoutes = require("./routes/projectRoutes"); // NEW
  const leaveRoutes = require("./routes/leaveRoutes");
  const taskRoutes = require("./routes/taskRoutes");

  
  dotenv.config();
  connectDB();

  const app = express();
  app.use(express.json());
  app.use(cors());
  
  app.use("/auth", authRoutes);
  app.use("/departments", departmentRoutes);
  app.use("/employees", employeeRoutes);
  app.use("/attendance", attendanceRoutes);
  app.use("/users", userRoutes);
  app.use("/admin", adminRoutes);
  app.use("/reminders", reminderRoutes);
  app.use("/projects", projectRoutes); // NEW
  app.use("/leaves", leaveRoutes);
  app.use("/tasks", taskRoutes);


  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
