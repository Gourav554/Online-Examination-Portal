const nodemailer = require("nodemailer");

let transporter = null;
let attemptedInit = false;

// Lazily initialized so the server can still boot without SMTP configured.
function getTransporter() {
  if (attemptedInit) return transporter;
  attemptedInit = true;

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter;
}

// Email is a side effect, never a hard dependency: failures are logged, never thrown.
async function sendMail({ to, subject, html }) {
  const client = getTransporter();

  if (!client) {
    console.log(`[email not configured] Would send "${subject}" to ${to}`);
    return;
  }

  try {
    await client.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, html });
  } catch (err) {
    console.error(`Failed to send email "${subject}" to ${to}:`, err.message);
  }
}

function wrapTemplate(title, bodyHtml) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h2 style="color: #1e3a8a;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">Online Examination Portal</p>
    </div>
  `;
}

async function sendRegistrationEmail(user) {
  await sendMail({
    to: user.email,
    subject: "Welcome to the Online Examination Portal",
    html: wrapTemplate(
      "Welcome!",
      `<p>Hi ${user.name},</p><p>Your account has been created successfully as a <strong>${user.role}</strong>.</p>`
    ),
  });
}

async function sendPasswordResetEmail(user, resetLink) {
  await sendMail({
    to: user.email,
    subject: "Reset Your Password",
    html: wrapTemplate(
      "Password Reset Request",
      `<p>Hi ${user.name},</p><p>Click the link below to reset your password. This link expires in 15 minutes.</p>
       <p><a href="${resetLink}" style="color: #1d4ed8;">${resetLink}</a></p>
       <p>If you didn't request this, you can safely ignore this email.</p>`
    ),
  });
}

async function sendExamConfirmationEmail(user, exam) {
  await sendMail({
    to: user.email,
    subject: `Exam Started: ${exam.title}`,
    html: wrapTemplate(
      "Exam Confirmation",
      `<p>Hi ${user.name},</p><p>You have started <strong>${exam.title}</strong>. Duration: ${exam.duration_minutes} minutes.</p>`
    ),
  });
}

async function sendResultEmail(user, exam, result) {
  await sendMail({
    to: user.email,
    subject: `Your Result: ${exam.title}`,
    html: wrapTemplate(
      "Exam Result",
      `<p>Hi ${user.name},</p>
       <p>You scored <strong>${result.obtainedMarks} / ${result.totalMarks}</strong> in <strong>${exam.title}</strong>.</p>
       <p>Status: <strong>${result.passed ? "Passed" : "Not Passed"}</strong> (Passing marks: ${result.passingMarks})</p>`
    ),
  });
}

module.exports = {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendExamConfirmationEmail,
  sendResultEmail,
};
