
const Announcement = require("../models/Announcement");

// Create announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Title and description are required.",
      });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      description: description.trim(),
      published: true,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create announcement.",
    });
  }
};

// Get published announcements for logged-in users
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      published: true,
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load announcements.",
    });
  }
};

// Get all announcements for admin
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load announcements.",
    });
  }
};

// Publish or hide an announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { title, description, published } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty.",
        });
      }
      announcement.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          message: "Description cannot be empty.",
        });
      }
      announcement.description = description.trim();
    }

    if (published !== undefined) {
      announcement.published = published;
    }

    await announcement.save();

    res.status(200).json({
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update announcement.",
    });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete announcement.",
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};