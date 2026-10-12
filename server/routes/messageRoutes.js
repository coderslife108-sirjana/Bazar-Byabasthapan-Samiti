const express = require("express");
const {
  getRecipients,
  sendMessage,
  getInbox,
  getSentMessages,
  getUnreadCount,
  markMessageRead,
} = require("../controllers/messageController");
const { protect, noticeManagerOrAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/inbox", getInbox);
router.get("/unread-count", getUnreadCount);
router.get("/sent", noticeManagerOrAdmin, getSentMessages);
router.get("/recipients", noticeManagerOrAdmin, getRecipients);
router.post("/", noticeManagerOrAdmin, sendMessage);
router.put("/:id/read", markMessageRead);

module.exports = router;
