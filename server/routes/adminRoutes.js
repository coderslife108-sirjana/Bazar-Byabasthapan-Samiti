const express = require("express");

const {
  createAdmin,
  getPendingUsers,
  approveUser,
  rejectUser,
  getDashboardStats,
  getAllUsers,
  suspendUser,
  reactivateUser,
   updateUserDetails,
  updateUserRole,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create first admin
router.post(
  "/create-first-admin",
  createAdmin
);

// Dashboard statistics - ADMIN ONLY
router.get(
  "/dashboard-stats",
  protect,
  adminOnly,
  getDashboardStats
);

// Get pending users - ADMIN ONLY
router.get(
  "/pending-users",
  protect,
  adminOnly,
  getPendingUsers
);

// Get all users - ADMIN ONLY
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// Approve user - ADMIN ONLY
router.put(
  "/users/:id/approve",
  protect,
  adminOnly,
  approveUser
);

// Reject user - ADMIN ONLY
router.put(
  "/users/:id/reject",
  protect,
  adminOnly,
  rejectUser
);

// Suspend user - ADMIN ONLY
router.put(
  "/users/:id/suspend",
  protect,
  adminOnly,
  suspendUser
);

// Reactivate user - ADMIN ONLY
router.put(
  "/users/:id/reactivate",
  protect,
  adminOnly,
  reactivateUser
);

// Update user details - ADMIN ONLY
router.put(
  "/users/:id",
  protect,
  adminOnly,
  updateUserDetails
);

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);



module.exports = router;