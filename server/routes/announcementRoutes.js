
const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Logged-in users can view published announcements
router.get("/", protect, getAnnouncements);

// Only admins can view all announcements
router.get("/all", protect, adminOnly, getAllAnnouncements);

// Only admins can create announcements
router.post("/", protect, adminOnly, createAnnouncement);

// Only admins can update announcements
router.put("/:id", protect, adminOnly, updateAnnouncement);

// Only admins can delete announcements
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;