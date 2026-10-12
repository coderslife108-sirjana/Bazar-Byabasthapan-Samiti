const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/messages", messageRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Dumkibas Bazar Management API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});