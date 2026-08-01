// One-time script to create the first admin account.
// Admins are provisioned this way, not through public registration (see authController).
// Usage: npm run seed:admin
require("dotenv").config({ quiet: true });
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL || "admin@examportal.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    console.log(`An account with email ${email} already exists. Nothing to do.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')", [
    name,
    email,
    hashedPassword,
  ]);

  console.log(`Admin account created: ${email} / ${password}`);
  console.log("Log in via the Login page with the Admin role selected.");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Failed to seed admin:", err.message);
  process.exit(1);
});
