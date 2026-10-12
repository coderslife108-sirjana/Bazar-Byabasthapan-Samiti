const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({ recipient: 1, readAt: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
