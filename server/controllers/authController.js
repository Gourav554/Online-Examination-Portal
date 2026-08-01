const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { success, error } = require("../utils/apiResponse");
const { isValidEmail, isValidPassword, isValidRole } = require("../utils/validators");
const { generateToken, sendTokenCookie } = require("../utils/generateToken");
const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const teacherModel = require("../models/teacherModel");
const { sendRegistrationEmail, sendPasswordResetEmail } = require("../services/emailService");

// Admin accounts are provisioned separately, not through public signup.
const REGISTERABLE_ROLES = ["student", "teacher"];

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !isValidEmail(email) || !isValidPassword(password)) {
    return error(res, 400, "Please provide a valid name, email and password (min 6 characters).");
  }

  if (!REGISTERABLE_ROLES.includes(role)) {
    return error(res, 400, "Role must be either student or teacher.");
  }

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    return error(res, 409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({ name, email, hashedPassword, role });

  if (role === "student") {
    await studentModel.createStudent({ userId, fullName: name, email });
  } else {
    await teacherModel.createTeacher({ userId, fullName: name, email });
  }

  const token = generateToken(userId, role);
  sendTokenCookie(res, token);

  await sendRegistrationEmail({ name, email, role });

  return success(res, 201, "Registration successful.", {
    user: { id: userId, name, email, role },
  });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password, role } = req.body;

  if (!isValidEmail(email) || !password || !isValidRole(role)) {
    return error(res, 400, "Please provide a valid email, password and role.");
  }

  const user = await userModel.findUserByEmail(email);
  const invalidCredsMessage = "Invalid email, password or role.";

  if (!user) {
    return error(res, 401, invalidCredsMessage);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch || user.role !== role) {
    return error(res, 401, invalidCredsMessage);
  }

  const token = generateToken(user.id, user.role);
  sendTokenCookie(res, token);

  return success(res, 200, "Login successful.", {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return error(res, 400, "Please provide a valid email.");
  }

  const genericMessage = "If an account with that email exists, a reset link has been sent.";
  const user = await userModel.findUserByEmail(email);

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await userModel.setResetToken(user.id, hashedToken, expiry);

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    console.log(`Password reset link for ${email}: ${resetLink}`); // dev fallback if SMTP isn't configured
    await sendPasswordResetEmail(user, resetLink);
  }

  return success(res, 200, genericMessage);
}

// GET /api/auth/me
async function getMe(req, res) {
  return success(res, 200, "Current user fetched.", { user: req.user });
}

// POST /api/auth/logout
async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return success(res, 200, "Logged out successfully.");
}

module.exports = { register, login, forgotPassword, getMe, logout };
