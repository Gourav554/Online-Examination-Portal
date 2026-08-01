const { pool } = require("../config/db");

// Created automatically once a submission is graded (see submissionService.gradeSubmission).
async function createResult({
  submissionId,
  examId,
  studentId,
  studentName,
  examName,
  totalMarks,
  obtainedMarks,
  passingMarks,
}) {
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const passed = obtainedMarks >= passingMarks;

  await pool.query(
    `INSERT INTO results
      (submission_id, exam_id, student_id, student_name, exam_name, total_marks, obtained_marks, percentage, passing_marks, passed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       student_name = VALUES(student_name), exam_name = VALUES(exam_name),
       total_marks = VALUES(total_marks), obtained_marks = VALUES(obtained_marks),
       percentage = VALUES(percentage), passing_marks = VALUES(passing_marks), passed = VALUES(passed)`,
    [
      submissionId,
      examId,
      studentId,
      studentName,
      examName,
      totalMarks,
      obtainedMarks,
      percentage.toFixed(2),
      passingMarks,
      passed,
    ]
  );
}

async function findResultBySubmissionId(submissionId) {
  const [rows] = await pool.query("SELECT * FROM results WHERE submission_id = ?", [submissionId]);
  return rows[0];
}

async function findResultsByStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT r.*, e.title AS exam_title
     FROM results r
     JOIN exams e ON e.id = r.exam_id
     WHERE r.student_id = ?
     ORDER BY r.generated_at DESC`,
    [studentId]
  );
  return rows;
}

async function findResultsByExam(examId) {
  const [rows] = await pool.query(
    `SELECT r.*, u.name AS student_name, u.email AS student_email
     FROM results r
     JOIN users u ON u.id = r.student_id
     WHERE r.exam_id = ?
     ORDER BY r.obtained_marks DESC`,
    [examId]
  );
  return rows;
}

async function computeStudentPerformance(studentId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS totalExams, COALESCE(AVG(percentage), 0) AS averagePercentage,
            COALESCE(SUM(passed), 0) AS passedCount
     FROM results WHERE student_id = ?`,
    [studentId]
  );
  return rows[0];
}

async function computeExamStatistics(examId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS attempts, COALESCE(AVG(percentage), 0) AS averagePercentage,
            COALESCE(MAX(obtained_marks), 0) AS highestMarks, COALESCE(MIN(obtained_marks), 0) AS lowestMarks,
            COALESCE(SUM(passed), 0) AS passedCount
     FROM results WHERE exam_id = ?`,
    [examId]
  );
  return rows[0];
}

// One row per exam owned by the teacher, with aggregate performance across all attempts.
async function findAllResultsForTeacher(teacherId) {
  const [rows] = await pool.query(
    `SELECT r.exam_id, e.title AS exam_title, COUNT(*) AS attempts,
            COALESCE(AVG(r.percentage), 0) AS averagePercentage, COALESCE(SUM(r.passed), 0) AS passedCount
     FROM results r
     JOIN exams e ON e.id = r.exam_id
     WHERE e.teacher_id = ?
     GROUP BY r.exam_id, e.title
     ORDER BY e.title`,
    [teacherId]
  );
  return rows;
}

module.exports = {
  createResult,
  findResultBySubmissionId,
  findResultsByStudent,
  findResultsByExam,
  computeStudentPerformance,
  computeExamStatistics,
  findAllResultsForTeacher,
};
