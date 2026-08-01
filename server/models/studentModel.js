const { pool } = require("../config/db");

async function createStudent({ userId, fullName, email }) {
  await pool.query("INSERT INTO students (user_id, full_name, email) VALUES (?, ?, ?)", [
    userId,
    fullName,
    email,
  ]);
}

module.exports = { createStudent };
