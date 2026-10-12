
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
  noticeManagerOrAdmin,
} = require("../middleware/authMiddleware");
const uploadNoticeImage = require("../middleware/noticeImageUpload");

const router = express.Router();

// View published notices — logged-in users
router.get("/", protect, getNotices);

// View all notices, including hidden ones — admin only
router.get("/all", protect, noticeManagerOrAdmin, getAllNotices);

// Create a notice — admin only
router.post("/", protect, noticeManagerOrAdmin, uploadNoticeImage, createNotice);

// Update or hide a notice — admin only
router.put("/:id", protect, noticeManagerOrAdmin, uploadNoticeImage, updateNotice);

// Delete a notice — admin only
router.delete("/:id", protect, noticeManagerOrAdmin, deleteNotice);

module.exports = router;