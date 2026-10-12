
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "This account is not active.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin access required.",
  });
};

const noticeManagerOrAdmin = (req, res, next) => {
  if (
    req.user &&
    ["admin", "noticeManager", "staff"].includes(req.user.role)
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Notice manager or admin access required.",
  });
};

module.exports = {
  protect,
  adminOnly,
  noticeManagerOrAdmin,
};