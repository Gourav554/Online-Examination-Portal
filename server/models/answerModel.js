const { pool } = require("../config/db");

// Called while the student is still attempting the exam (no grading yet).
async function upsertAnswer({ submissionId, questionId, answerText }) {
  await pool.query(
    `INSERT INTO answers (submission_id, question_id, answer_text)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE answer_text = VALUES(answer_text)`,
    [submissionId, questionId, answerText]
  );
  
}

// Called during grading; also covers questions the student never answered.
async function upsertGradedAnswer({ submissionId, questionId, answerText, isCorrect, marksObtained }) {
  await pool.query(
    `INSERT INTO answers (submission_id, question_id, answer_text, is_correct, marks_obtained)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       answer_text = VALUES(answer_text), is_correct = VALUES(is_correct), marks_obtained = VALUES(marks_obtained)`,
    [submissionId, questionId, answerText, isCorrect, marksObtained]
  );
}

async function findAnswersBySubmission(submissionId) {
  const [rows] = await pool.query("SELECT * FROM answers WHERE submission_id = ?", [submissionId]);
  return rows;
}

module.exports = { upsertAnswer, upsertGradedAnswer, findAnswersBySubmission };







