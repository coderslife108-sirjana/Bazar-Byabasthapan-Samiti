const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Waste Management",
        "Road/Infrastructure",
        "Market Management",
        "Street/Vendor Issues",
        "Sanitation",
        "Electricity/Lighting",
        "Water",
        "Security",
        "Other",
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved",
      ],
      default: "Submitted",
    },

    adminResponse: {
      type: String,
      default: "",
    },

    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);