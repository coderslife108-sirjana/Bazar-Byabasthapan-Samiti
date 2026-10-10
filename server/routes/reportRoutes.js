
const express = require("express");

const {
  createReport,
  getReports,
  getReportById,
  updateReport,
} = require("../controllers/reportController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create a report — logged-in users
router.post("/", protect, createReport);

// Get reports — users see their own; admin sees all
router.get("/", protect, getReports);

// Get one report — owner or admin
router.get("/:id", protect, getReportById);

// Update report status or admin response — admin only
router.put("/:id", protect, adminOnly, updateReport);

module.exports = router;