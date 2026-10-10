
const Notice = require("../models/Notice");

// CREATE NOTICE — ADMIN ONLY
const createNotice = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Please provide a title and description.",
      });
    }

    const notice = await Notice.create({
      title: title.trim(),
      description: description.trim(),
      category: category || "General",
      createdBy: req.user._id,
      published: true,
    });

    res.status(201).json({
      message: "Notice published successfully.",
      notice,
    });
  } catch (error) {
    console.error("Create notice error:", error);
    res.status(500).json({
      message: "Server error while creating notice.",
    });
  }
};

// GET PUBLISHED NOTICES — LOGGED-IN USERS
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ published: true })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error("Get notices error:", error);
    res.status(500).json({
      message: "Server error while fetching notices.",
    });
  }
};

// GET ALL NOTICES — ADMIN ONLY
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error("Get all notices error:", error);
    res.status(500).json({
      message: "Server error while fetching notices.",
    });
  }
};

// UPDATE NOTICE — ADMIN ONLY
const updateNotice = async (req, res) => {
  try {
    const { title, description, category, published } = req.body;

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found.",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty.",
        });
      }
      notice.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          message: "Description cannot be empty.",
        });
      }
      notice.description = description.trim();
    }

    if (category !== undefined) notice.category = category;
    if (published !== undefined) notice.published = published;

    await notice.save();

    res.status(200).json({
      message: "Notice updated successfully.",
      notice,
    });
  } catch (error) {
    console.error("Update notice error:", error);
    res.status(500).json({
      message: "Server error while updating notice.",
    });
  }
};

// DELETE NOTICE — ADMIN ONLY
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found.",
      });
    }

    await notice.deleteOne();

    res.status(200).json({
      message: "Notice deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notice error:", error);
    res.status(500).json({
      message: "Server error while deleting notice.",
    });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getAllNotices,
  updateNotice,
  deleteNotice,
};