const { pool } = require("../config/db");

async function createSubmission({ examId, studentId, paperSnapshot }) {
  const [result] = await pool.query(
    "INSERT INTO submissions (exam_id, student_id, paper_snapshot) VALUES (?, ?, ?)",
    [examId, studentId, JSON.stringify(paperSnapshot)]
  );
  return result.insertId;
}

async function findSubmissionByExamAndStudent(examId, studentId) {
  const [rows] = await pool.query("SELECT * FROM submissions WHERE exam_id = ? AND student_id = ?", [
    examId,
    studentId,
  ]);
  return rows[0];
}

async function findSubmissionById(id) {
  const [rows] = await pool.query("SELECT * FROM submissions WHERE id = ?", [id]);
  return rows[0];
}

async function finalizeSubmission(id, { totalMarks, obtainedMarks }) {
  await pool.query(
    "UPDATE submissions SET status = 'submitted', submitted_at = NOW(), total_marks = ?, obtained_marks = ? WHERE id = ?",
    [totalMarks, obtainedMarks, id]
  );
}

// Admin-facing helper (Phase 6): exams currently being attempted, platform-wide.
async function findOngoingSubmissions() {
  const [rows] = await pool.query(
    `SELECT s.id, s.started_at, u.name AS student_name, e.title AS exam_title, e.duration_minutes
     FROM submissions s
     JOIN users u ON u.id = s.student_id
     JOIN exams e ON e.id = s.exam_id
     WHERE s.status = 'in_progress'
     ORDER BY s.started_at DESC`
  );
  return rows;
}

module.exports = {
  createSubmission,
  findSubmissionByExamAndStudent,
  findSubmissionById,
  finalizeSubmission,
  findOngoingSubmissions,
};
