const Message = require("../models/Message");
const User = require("../models/User");

const canSendMessages = (user) =>
  ["admin", "noticeManager", "staff"].includes(user.role);

const getRecipients = async (_req, res) => {
  try {
    const members = await User.find({ role: "member", status: "active" })
      .select("name email")
      .sort({ name: 1 });
    res.status(200).json({ members });
  } catch (error) {
    console.error("Get message recipients error:", error);
    res.status(500).json({ message: "Could not load message recipients." });
  }
};

const sendMessage = async (req, res) => {
  try {
    if (!canSendMessages(req.user)) {
      return res.status(403).json({ message: "Only admins and notice managers can send messages." });
    }

    const { recipientId, body } = req.body;
    if (
      typeof recipientId !== "string" ||
      !/^[a-f\d]{24}$/i.test(recipientId) ||
      typeof body !== "string" ||
      !body.trim()
    ) {
      return res.status(400).json({ message: "Select a member and enter a message." });
    }

    if (body.trim().length > 5000) {
      return res.status(400).json({ message: "Messages must be 5,000 characters or fewer." });
    }

    const recipient = await User.findOne({
      _id: recipientId,
      role: "member",
      status: "active",
    }).select("_id");

    if (!recipient) {
      return res.status(404).json({ message: "Active member not found." });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipient._id,
      body: body.trim(),
    });

    await message.populate([
      { path: "sender", select: "name role" },
      { path: "recipient", select: "name role" },
    ]);

    res.status(201).json({ message: "Message sent.", item: message });
  } catch (error) {
    console.error("Send private message error:", error);
    res.status(500).json({ message: "Could not send the message." });
  }
};

const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .populate("sender", "name role")
      .sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Load message inbox error:", error);
    res.status(500).json({ message: "Could not load your inbox." });
  }
};

const getSentMessages = async (req, res) => {
  try {
    if (!canSendMessages(req.user)) {
      return res.status(403).json({ message: "Sent messages are available to admins and notice managers." });
    }

    const messages = await Message.find({ sender: req.user._id })
      .populate("recipient", "name role")
      .sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Load sent messages error:", error);
    res.status(500).json({ message: "Could not load sent messages." });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      readAt: null,
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Get unread messages count error:", error);
    res.status(500).json({ message: "Could not load unread message count." });
  }
};

const markMessageRead = async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
      return res.status(404).json({ message: "Message not found." });
    }

    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id, readAt: null },
      { $set: { readAt: new Date() } },
      { new: true }
    );

    if (message) {
      return res.status(200).json({ message: "Message marked as read." });
    }

    const existing = await Message.exists({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!existing) {
      return res.status(404).json({ message: "Message not found." });
    }

    return res.status(200).json({ message: "Message was already read." });
  } catch (error) {
    console.error("Mark private message read error:", error);
    res.status(500).json({ message: "Could not update message read status." });
  }
};

module.exports = {
  getRecipients,
  sendMessage,
  getInbox,
  getSentMessages,
  getUnreadCount,
  markMessageRead,
};
