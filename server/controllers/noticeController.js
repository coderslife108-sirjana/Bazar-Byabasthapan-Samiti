
const Notice = require("../models/Notice");
const fs = require("fs/promises");
const path = require("path");

const getUploadedFiles = (req) => [
  ...(req.files?.attachment || []),
  ...(req.files?.image || []),
];

const removeUploadedFiles = async (files) => {
  await Promise.all(files.map(async (file) => {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Could not remove failed notice attachment:", error);
      }
    }
  }));
};

const removeSavedAttachment = async (notice) => {
  const storedPath = notice.attachment?.path || notice.image;
  if (!storedPath?.startsWith("uploads/notices/")) return;
  try {
    await fs.unlink(path.join(__dirname, "..", storedPath));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Could not remove notice attachment:", error);
    }
  }
};

const parseNoticeDates = (publishedAt, expiresAt) => {
  const publicationDate =
    publishedAt === undefined || publishedAt === ""
      ? new Date()
      : new Date(publishedAt);
  const expiryDate =
    expiresAt === undefined || expiresAt === "" || expiresAt === null
      ? null
      : new Date(expiresAt);

  if (
    Number.isNaN(publicationDate.getTime()) ||
    (expiryDate && Number.isNaN(expiryDate.getTime())) ||
    (expiryDate && expiryDate <= publicationDate)
  ) {
    return null;
  }

  return { publicationDate, expiryDate };
};

// CREATE NOTICE — ADMIN OR NOTICE MANAGER
const createNotice = async (req, res) => {
  const files = getUploadedFiles(req);
  try {
    const { title, description, category, publishedAt, expiresAt } = req.body;
    const dates = parseNoticeDates(publishedAt, expiresAt);

    if (!title?.trim() || !description?.trim() || !dates) {
      await removeUploadedFiles(files);
      return res.status(400).json({
        message: !dates
          ? "Please provide valid publication and expiry dates."
          : "Please provide a title and description.",
      });
    }

    if (
      category !== undefined &&
      !["General", "Meeting", "Waste Management", "Important"].includes(category)
    ) {
      await removeUploadedFiles(files);
      return res.status(400).json({
        message: "Please provide a valid notice category.",
      });
    }

    if (files.length > 1) {
      await removeUploadedFiles(files);
      return res.status(400).json({
        message: "Please upload only one attachment.",
      });
    }

    const file = files[0];
    const filePath = file ? `uploads/notices/${file.filename}` : "";
    const notice = await Notice.create({
      title: title.trim(),
      description: description.trim(),
      image: file?.mimetype.startsWith("image/") ? filePath : "",
      attachment: file
        ? { path: filePath, name: file.originalname, mimeType: file.mimetype }
        : undefined,
      category: category || "General",
      createdBy: req.user._id,
      published: true,
      publishedAt: dates.publicationDate,
      expiresAt: dates.expiryDate,
    });

    res.status(201).json({
      message: "Notice published successfully.",
      notice,
    });
  } catch (error) {
    await removeUploadedFiles(files);
    console.error("Create notice error:", error);
    res.status(500).json({
      message: "Server error while creating notice.",
    });
  }
};

// GET PUBLISHED NOTICES — LOGGED-IN USERS
const getNotices = async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({
      published: true,
      $and: [
        {
          $or: [
            { publishedAt: { $lte: now } },
            { publishedAt: { $exists: false } },
          ],
        },
        {
          $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        },
      ],
    })
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

// GET ALL NOTICES — ADMIN OR NOTICE MANAGER
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

// UPDATE NOTICE — ADMIN OR NOTICE MANAGER
const updateNotice = async (req, res) => {
  const files = getUploadedFiles(req);
  try {
    const {
      title,
      description,
      category,
      published,
      publishedAt,
      expiresAt,
    } = req.body;

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      await removeUploadedFiles(files);
      return res.status(404).json({
        message: "Notice not found.",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        await removeUploadedFiles(files);
        return res.status(400).json({
          message: "Title cannot be empty.",
        });
      }
      notice.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        await removeUploadedFiles(files);
        return res.status(400).json({
          message: "Description cannot be empty.",
        });
      }
      notice.description = description.trim();
    }

    if (
      category !== undefined &&
      !["General", "Meeting", "Waste Management", "Important"].includes(category)
    ) {
      await removeUploadedFiles(files);
      return res.status(400).json({ message: "Please provide a valid notice category." });
    }

    if (category !== undefined) notice.category = category;
    if (published !== undefined) notice.published = published;

    const nextPublishedAt =
      publishedAt === undefined ? notice.publishedAt : publishedAt;
    const nextExpiresAt =
      expiresAt === undefined ? notice.expiresAt : expiresAt;
    const dates = parseNoticeDates(nextPublishedAt, nextExpiresAt);

    if (!dates) {
      await removeUploadedFiles(files);
      return res.status(400).json({
        message: "Please provide valid publication and expiry dates.",
      });
    }

    if (files.length > 1) {
      await removeUploadedFiles(files);
      return res.status(400).json({
        message: "Please upload only one attachment.",
      });
    }

    if (files[0]) {
      await removeSavedAttachment(notice);
      const file = files[0];
      const filePath = `uploads/notices/${file.filename}`;
      notice.image = file.mimetype.startsWith("image/") ? filePath : "";
      notice.attachment = {
        path: filePath,
        name: file.originalname,
        mimeType: file.mimetype,
      };
    }

    notice.publishedAt = dates.publicationDate;
    notice.expiresAt = dates.expiryDate;
    await notice.save();

    res.status(200).json({
      message: "Notice updated successfully.",
      notice,
    });
  } catch (error) {
    await removeUploadedFiles(files);
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
    await removeSavedAttachment(notice);

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