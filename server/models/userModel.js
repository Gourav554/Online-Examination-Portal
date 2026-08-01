const { pool } = require("../config/db");

// All raw SQL for the "users" table lives here (Model layer).

async function createUser({ name, email, hashedPassword, role }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
}

async function setResetToken(userId, resetToken, expiry) {
  await pool.query(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
    [resetToken, expiry, userId]
  );
}

// Admin-facing helpers (Phase 6).

async function findUsersByRole(role) {
  const [rows] = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE role = ? ORDER BY created_at DESC",
    [role]
  );
  return rows;
}

async function countByRole(role) {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = ?", [role]);
  return rows[0].count;
}

async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  setResetToken,
  findUsersByRole,
  countByRole,
  deleteUser,
};
