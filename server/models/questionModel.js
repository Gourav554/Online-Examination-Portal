const { pool } = require("../config/db");

async function createQuestion({ examId, questionText, questionType, options, correctAnswer, marks }) {
  const [result] = await pool.query(
    `INSERT INTO questions (exam_id, question_text, question_type, options, correct_answer, marks)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [examId, questionText, questionType, options ? JSON.stringify(options) : null, correctAnswer, marks]
  );
  return result.insertId;
}

async function findQuestionsByExam(examId) {
  const [rows] = await pool.query(
    "SELECT * FROM questions WHERE exam_id = ? ORDER BY id ASC",
    [examId]
  );
  return rows;
}

async function findQuestionById(id) {
  const [rows] = await pool.query("SELECT * FROM questions WHERE id = ?", [id]);
  return rows[0];
}

async function updateQuestion(id, { questionText, questionType, options, correctAnswer, marks }) {
  await pool.query(
    `UPDATE questions SET
      question_text = ?, question_type = ?, options = ?, correct_answer = ?, marks = ?
     WHERE id = ?`,
    [questionText, questionType, options ? JSON.stringify(options) : null, correctAnswer, marks, id]
  );
}

async function deleteQuestion(id) {
  await pool.query("DELETE FROM questions WHERE id = ?", [id]);
}

module.exports = {
  createQuestion,
  findQuestionsByExam,
  findQuestionById,
  updateQuestion,
  deleteQuestion,
};
