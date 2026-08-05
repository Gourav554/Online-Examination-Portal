const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");
const { findUserById } = require("../models/userModel");


async function protect(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return error(res, 401, "Not authorized. Please login.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return error(res, 401, "User no longer exists.");
    }

    req.user = user;
    next();
  } catch {
    return error(res, 401, "Invalid or expired session. Please login again.");
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, 403, "You do not have permission to perform this action.");
    }
    next();
  };
}

module.exports = { protect, authorize };
