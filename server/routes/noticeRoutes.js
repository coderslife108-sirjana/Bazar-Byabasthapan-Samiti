
const express = require("express");

const {
  createNotice,
  getNotices,
  getAllNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// View published notices — logged-in users
router.get("/", protect, getNotices);

// View all notices, including hidden ones — admin only
router.get("/all", protect, adminOnly, getAllNotices);

// Create a notice — admin only
router.post("/", protect, adminOnly, createNotice);

// Update or hide a notice — admin only
router.put("/:id", protect, adminOnly, updateNotice);

// Delete a notice — admin only
router.delete("/:id", protect, adminOnly, deleteNotice);

module.exports = router;