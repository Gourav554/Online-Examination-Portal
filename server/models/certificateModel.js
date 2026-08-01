const { pool } = require("../config/db");

async function createCertificate({
  resultId,
  certificateCode,
  studentId,
  studentName,
  examId,
  examName,
  score,
}) {
  await pool.query(
    `INSERT INTO certificates
      (result_id, certificate_code, student_id, student_name, exam_id, exam_name, score)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE certificate_code = certificate_code`,
    [resultId, certificateCode, studentId, studentName, examId, examName, score]
  );
}

async function findCertificateByResultId(resultId) {
  const [rows] = await pool.query("SELECT * FROM certificates WHERE result_id = ?", [resultId]);
  return rows[0];
}

// Admin-facing helper (Phase 6).
async function findAllCertificates() {
  const [rows] = await pool.query(
    `SELECT c.*, u.name AS student_name, e.title AS exam_title
     FROM certificates c
     JOIN results r ON r.id = c.result_id
     JOIN users u ON u.id = r.student_id
     JOIN exams e ON e.id = r.exam_id
     ORDER BY c.issued_at DESC`
  );
  return rows;
}

// Student-facing: every passed result, with certificate info attached once issued
// (certificate_code/issued_at are null until the student's first download).
async function findCertificateEligibleResultsByStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT r.id AS result_id, r.submission_id, r.exam_id, r.obtained_marks, r.total_marks, r.generated_at,
            e.title AS exam_title, c.certificate_code, c.issued_at
     FROM results r
     JOIN exams e ON e.id = r.exam_id
     LEFT JOIN certificates c ON c.result_id = r.id
     WHERE r.student_id = ? AND r.passed = TRUE
     ORDER BY r.generated_at DESC`,
    [studentId]
  );
  return rows;
}

module.exports = {
  createCertificate,
  findCertificateByResultId,
  findAllCertificates,
  findCertificateEligibleResultsByStudent,
};
