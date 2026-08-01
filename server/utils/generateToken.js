const jwt = require("jsonwebtoken");

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Sends the JWT as an httpOnly cookie so it can't be read by JS (XSS-safe).
function sendTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

module.exports = { generateToken, sendTokenCookie };
