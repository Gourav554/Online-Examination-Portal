const { success, error } = require("../utils/apiResponse");
const { validateQuestionData } = require("../utils/validators");
const examModel = require("../models/examModel");
const questionModel = require("../models/questionModel");

// Confirms the exam exists and belongs to the logged-in teacher.
async function getOwnedExam(examId, teacherId) {
  const exam = await examModel.findExamById(examId);
  if (!exam) return { exam: null, errorMessage: "Exam not found.", statusCode: 404 };
  if (exam.teacher_id !== teacherId) {
    return { exam: null, errorMessage: "You do not own this exam.", statusCode: 403 };
  }
  return { exam, errorMessage: null };
}

// POST /api/exams/:examId/questions
async function addQuestion(req, res) {
  const { exam, errorMessage, statusCode } = await getOwnedExam(req.params.examId, req.user.id);
  if (errorMessage) {
    return error(res, statusCode, errorMessage);
  }

  const { questionText, questionType, options, correctAnswer, marks } = req.body;
  const validationError = validateQuestionData({ questionText, questionType, options, correctAnswer, marks });
  if (validationError) {
    return error(res, 400, validationError);
  }

  const questionId = await questionModel.createQuestion({
    examId: exam.id,
    questionText,
    questionType,
    options: questionType === "mcq" ? options : null,
    correctAnswer: questionType === "descriptive" ? null : correctAnswer,
    marks,
  });

  const question = await questionModel.findQuestionById(questionId);
  return success(res, 201, "Question added successfully.", { question });
}

// PUT /api/questions/:id
async function editQuestion(req, res) {
  const question = await questionModel.findQuestionById(req.params.id);
  if (!question) {
    return error(res, 404, "Question not found.");
  }

  const { errorMessage, statusCode } = await getOwnedExam(question.exam_id, req.user.id);
  if (errorMessage) {
    return error(res, statusCode, errorMessage);
  }

  const { questionText, questionType, options, correctAnswer, marks } = req.body;
  const validationError = validateQuestionData({ questionText, questionType, options, correctAnswer, marks });
  if (validationError) {
    return error(res, 400, validationError);
  }

  await questionModel.updateQuestion(question.id, {
    questionText,
    questionType,
    options: questionType === "mcq" ? options : null,
    correctAnswer: questionType === "descriptive" ? null : correctAnswer,
    marks,
  });

  const updatedQuestion = await questionModel.findQuestionById(question.id);
  return success(res, 200, "Question updated successfully.", { question: updatedQuestion });
}

// DELETE /api/questions/:id
async function deleteQuestion(req, res) {
  const question = await questionModel.findQuestionById(req.params.id);
  if (!question) {
    return error(res, 404, "Question not found.");
  }

  const { errorMessage, statusCode } = await getOwnedExam(question.exam_id, req.user.id);
  if (errorMessage) {
    return error(res, statusCode, errorMessage);
  }

  await questionModel.deleteQuestion(question.id);
  return success(res, 200, "Question deleted successfully.");
}

module.exports = { addQuestion, editQuestion, deleteQuestion };
