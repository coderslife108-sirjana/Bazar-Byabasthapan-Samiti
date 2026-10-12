const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "../uploads/notices");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      const extension = allowedTypes[file.mimetype];
      callback(null, `${Date.now()}-${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes[file.mimetype]) {
      callback(new Error("Only JPG, PNG, WEBP, GIF, and PDF files are supported."));
      return;
    }

    callback(null, true);
  },
}).fields([
  { name: "attachment", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

const uploadNoticeImage = (req, res, next) => {
  upload(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Notice attachments must be 10 MB or smaller."
        : error.message;

    res.status(400).json({ message });
  });
};

module.exports = uploadNoticeImage;
