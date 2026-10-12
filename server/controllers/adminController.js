const User = require("../models/User");
const Report = require("../models/Report");
const bcrypt = require("bcryptjs");

// ======================================================
// CREATE FIRST ADMIN
// ======================================================
const createAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "An admin account already exists",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      address,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      message: "Server error while creating admin",
    });
  }
};

// ======================================================
// GET PENDING USERS
// ======================================================
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "member",
      status: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get pending users error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// APPROVE USER
// ======================================================
const approveUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
      status: "pending",
    });

    if (!user) {
      return res.status(404).json({
        message: "Pending user not found",
      });
    }

    user.status = "active";

    await user.save();

    res.status(200).json({
      message: "User approved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Approve user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// REJECT USER
// ======================================================
const rejectUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
      status: "pending",
    });

    if (!user) {
      return res.status(404).json({
        message: "Pending user not found",
      });
    }

    user.status = "rejected";

    await user.save();

    res.status(200).json({
      message: "User rejected successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Reject user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// GET ADMIN DASHBOARD STATS
// ======================================================
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalReports,
    ] = await Promise.all([
      User.countDocuments({
        role: "member",
      }),

      User.countDocuments({
        role: "member",
        status: "active",
      }),

      User.countDocuments({
        role: "member",
        status: "pending",
      }),

      Report.countDocuments(),
    ]);

    res.status(200).json({
      totalUsers,
      activeUsers,
      pendingUsers,
      totalReports,
    });
  } catch (error) {
    console.error(
      "Get dashboard stats error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching dashboard statistics",
    });
  }
};

// ======================================================
// GET ALL USERS
// ======================================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const allowedRoles = ["admin", "noticeManager", "member"];
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Please select a valid user role.",
      });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: "You cannot change your own role.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (role !== "member" && user.status !== "active") {
      return res.status(400).json({
        message: "Approve the user before assigning an elevated role.",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      message: "Server error while updating user role.",
    });
  }
};


const updateUserDetails = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !address?.trim()
    ) {
      return res.status(400).json({
        message: "Name, phone, and address are required",
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
    });

    if (!user) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    user.name = name.trim();
    user.phone = phone.trim();
    user.address = address.trim();

    await user.save();

    res.status(200).json({
      message: "User details updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update user details error:", error);

    res.status(500).json({
      message: "Server error while updating user details",
    });
  }
};

// ======================================================
// SUSPEND USER
// ======================================================
const suspendUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.status = "suspended";

    await user.save();

    res.status(200).json({
      message: "User suspended successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Suspend user error:", error);

    res.status(500).json({
      message: "Server error while suspending user",
    });
  }
};


const reactivateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
      status: "suspended",
    });

    if (!user) {
      return res.status(404).json({
        message: "Suspended user not found",
      });
    }

    user.status = "active";

    await user.save();

    res.status(200).json({
      message: "User reactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Reactivate user error:", error);

    res.status(500).json({
      message: "Server error while reactivating user",
    });
  }
};

module.exports = {
  createAdmin,
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  getDashboardStats,
  suspendUser,
  reactivateUser,
  updateUserDetails,
  updateUserRole,
};  
