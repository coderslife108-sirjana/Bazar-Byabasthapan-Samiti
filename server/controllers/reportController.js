const Report = require("../models/Report");

// ======================================================
// CREATE REPORT
// ======================================================
const createReport = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
    } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const report = await Report.create({
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      createdBy: req.user._id,
      status: "Submitted",
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    res.status(500).json({
      message: "Server error while creating report",
    });
  }
};

// ======================================================
// GET REPORTS
// ======================================================
const getReports = async (req, res) => {
  try {
    let reports;

    // Admin can see ALL reports
    if (req.user.role === "admin") {
      reports = await Report.find()
        .populate("createdBy", "name email phone address")
        .sort({ createdAt: -1 });
    }

    // Staff/member can see ONLY their own reports
    else {
      reports = await Report.find({
        createdBy: req.user._id,
      }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    res.status(500).json({
      message: "Server error while fetching reports",
    });
  }
};

// ======================================================
// GET SINGLE REPORT
// ======================================================
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email phone address"
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Admin can view any report
    if (req.user.role === "admin") {
      return res.status(200).json({
        report,
      });
    }

    // Normal user can ONLY view their own report
    if (
      report.createdBy._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to view this report",
      });
    }

    res.status(200).json({
      report,
    });
  } catch (error) {
    console.error("Get report error:", error);

    res.status(500).json({
      message: "Server error while fetching report",
    });
  }
};

// ======================================================
// UPDATE REPORT
// ADMIN ONLY
// ======================================================
const updateReport = async (req, res) => {
  try {
    const {
      status,
      adminResponse,
    } = req.body;

    // Find report
    const report = await Report.findById(
      req.params.id
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Validate status
    const allowedStatuses = [
      "Draft",
      "Submitted",
      "Under Review",
      "In Progress",
      "Resolved",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid report status",
      });
    }

    // Update status
    if (status) {
      report.status = status;
    }

    // Update admin response
    if (adminResponse !== undefined) {
      report.adminResponse =
        adminResponse.trim();
    }

    await report.save();

    // Get updated report with user information
    const updatedReport = await Report.findById(
      report._id
    ).populate(
      "createdBy",
      "name email phone address"
    );

    res.status(200).json({
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update report error:", error);

    res.status(500).json({
      message: "Server error while updating report",
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================
module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
};