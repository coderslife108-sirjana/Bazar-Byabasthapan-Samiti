
const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    attachment: {
      path: { type: String, default: "" },
      name: { type: String, default: "" },
      mimeType: { type: String, default: "" },
    },
    category: {
      type: String,
      enum: [
        "General",
        "Meeting",
        "Waste Management",
        "Important",
      ],
      default: "General",
    },
    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);