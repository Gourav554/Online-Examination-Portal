const { pool } = require("../config/db");

async function createTeacher({ userId, fullName, email }) {
  await pool.query("INSERT INTO teachers (user_id, full_name, email) VALUES (?, ?, ?)", [
    userId,
    fullName,
    email,
  ]);
}

module.exports = { createTeacher };
