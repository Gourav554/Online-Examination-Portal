const { pool } = require("../config/db");

async function createExam({
  teacherId,
  title,
  description,
  subject,
  durationMinutes,
  passingMarks,
  negativeMarks,
  randomizeQuestions,
  randomizeOptions,
}) {
  const [result] = await pool.query(
    `INSERT INTO exams
      (teacher_id, title, description, subject, duration_minutes, passing_marks, negative_marks, randomize_questions, randomize_options)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      teacherId,
      title,
      description || null,
      subject || null,
      durationMinutes,
      passingMarks,
      negativeMarks,
      randomizeQuestions,
      randomizeOptions,
    ]
  );
  return result.insertId;
}

async function findExamsByTeacher(teacherId) {
  const [rows] = await pool.query(
    "SELECT * FROM exams WHERE teacher_id = ? ORDER BY created_at DESC",
    [teacherId]
  );
  return rows;
}

async function findExamById(id) {
  const [rows] = await pool.query("SELECT * FROM exams WHERE id = ?", [id]);
  return rows[0];
}

async function updateExam(id, fields) {
  const {
    title,
    description,
    subject,
    durationMinutes,
    passingMarks,
    negativeMarks,
    randomizeQuestions,
    randomizeOptions,
  } = fields;

  await pool.query(
    `UPDATE exams SET
      title = ?, description = ?, subject = ?, duration_minutes = ?, passing_marks = ?,
      negative_marks = ?, randomize_questions = ?, randomize_options = ?
     WHERE id = ?`,
    [
      title,
      description || null,
      subject || null,
      durationMinutes,
      passingMarks,
      negativeMarks,
      randomizeQuestions,
      randomizeOptions,
      id,
    ]
  );
}

async function updateExamStatus(id, status) {
  await pool.query("UPDATE exams SET status = ? WHERE id = ?", [status, id]);
}

async function deleteExam(id) {
  await pool.query("DELETE FROM exams WHERE id = ?", [id]);
}

async function countQuestionsForExam(examId) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count, COALESCE(SUM(marks), 0) AS totalMarks FROM questions WHERE exam_id = ?",
    [examId]
  );
  return rows[0];
}

async function findPublishedExamById(id) {
  const [rows] = await pool.query("SELECT * FROM exams WHERE id = ? AND status = 'published'", [id]);
  return rows[0];
}

// Published exams with each student's attempt status attached (null if not started).
async function findPublishedExamsForStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT e.id, e.title, e.description, e.subject, e.duration_minutes, e.passing_marks, e.negative_marks,
            s.status AS submission_status, s.id AS submission_id,
            (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.id) AS question_count,
            (SELECT COALESCE(SUM(marks), 0) FROM questions q WHERE q.exam_id = e.id) AS total_marks
     FROM exams e
     LEFT JOIN submissions s ON s.exam_id = e.id AND s.student_id = ?
     WHERE e.status = 'published'
     ORDER BY e.created_at DESC`,
    [studentId]
  );
  return rows;
}

// Admin-facing helpers (Phase 6).

async function findAllExamsForAdmin() {
  const [rows] = await pool.query(
    `SELECT e.*, u.name AS teacher_name
     FROM exams e
     JOIN users u ON u.id = e.teacher_id
     ORDER BY e.created_at DESC`
  );
  return rows;
}

async function countAllExams() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM exams");
  return rows[0].count;
}

module.exports = {
  createExam,
  findExamsByTeacher,
  findExamById,
  updateExam,
  updateExamStatus,
  deleteExam,
  countQuestionsForExam,
  findPublishedExamById,
  findPublishedExamsForStudent,
  findAllExamsForAdmin,
  countAllExams,
};
