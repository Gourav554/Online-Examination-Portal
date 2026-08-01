const { success, error } = require("../utils/apiResponse");
const examModel = require("../models/examModel");
const questionModel = require("../models/questionModel");

// POST /api/exams
async function createExam(req, res) {
  const {
    title,
    description,
    subject,
    durationMinutes,
    passingMarks,
    negativeMarks,
    randomizeQuestions,
    randomizeOptions,
  } = req.body;

  if (!title || !Number.isInteger(durationMinutes) || durationMinutes < 1) {
    return error(res, 400, "Title and a valid duration (in minutes) are required.");
  }

  const examId = await examModel.createExam({
    teacherId: req.user.id,
    title,
    description,
    subject,
    durationMinutes,
    passingMarks: Number.isInteger(passingMarks) ? passingMarks : 0,
    negativeMarks: typeof negativeMarks === "number" ? negativeMarks : 0,
    randomizeQuestions: !!randomizeQuestions,
    randomizeOptions: !!randomizeOptions,
  });

  const exam = await examModel.findExamById(examId);
  return success(res, 201, "Exam created successfully.", { exam });
}

// GET /api/exams
async function getMyExams(req, res) {
  const exams = await examModel.findExamsByTeacher(req.user.id);
  return success(res, 200, "Exams fetched.", { exams });
}

// GET /api/exams/:id
async function getExamDetails(req, res) {
  const exam = await examModel.findExamById(req.params.id);

  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  if (exam.teacher_id !== req.user.id) {
    return error(res, 403, "You do not own this exam.");
  }

  const questions = await questionModel.findQuestionsByExam(exam.id);
  return success(res, 200, "Exam details fetched.", { exam, questions });
}

// PUT /api/exams/:id
async function updateExam(req, res) {
  const exam = await examModel.findExamById(req.params.id);

  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  if (exam.teacher_id !== req.user.id) {
    return error(res, 403, "You do not own this exam.");
  }

  const {
    title,
    description,
    subject,
    durationMinutes,
    passingMarks,
    negativeMarks,
    randomizeQuestions,
    randomizeOptions,
  } = req.body;

  if (!title || !Number.isInteger(durationMinutes) || durationMinutes < 1) {
    return error(res, 400, "Title and a valid duration (in minutes) are required.");
  }

  await examModel.updateExam(exam.id, {
    title,
    description,
    subject,
    durationMinutes,
    passingMarks: Number.isInteger(passingMarks) ? passingMarks : 0,
    negativeMarks: typeof negativeMarks === "number" ? negativeMarks : 0,
    randomizeQuestions: !!randomizeQuestions,
    randomizeOptions: !!randomizeOptions,
  });

  const updatedExam = await examModel.findExamById(exam.id);
  return success(res, 200, "Exam updated successfully.", { exam: updatedExam });
}

// DELETE /api/exams/:id
async function deleteExam(req, res) {
  const exam = await examModel.findExamById(req.params.id);

  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  if (exam.teacher_id !== req.user.id) {
    return error(res, 403, "You do not own this exam.");
  }

  await examModel.deleteExam(exam.id);
  return success(res, 200, "Exam deleted successfully.");
}

// PATCH /api/exams/:id/publish
async function publishExam(req, res) {
  const { status } = req.body;

  if (!["draft", "published"].includes(status)) {
    return error(res, 400, "Status must be 'draft' or 'published'.");
  }

  const exam = await examModel.findExamById(req.params.id);

  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  if (exam.teacher_id !== req.user.id) {
    return error(res, 403, "You do not own this exam.");
  }

  if (status === "published") {
    const { count, totalMarks } = await examModel.countQuestionsForExam(exam.id);
    if (count === 0) {
      return error(res, 400, "Add at least one question before publishing.");
    }
    if (exam.passing_marks > totalMarks) {
      return error(res, 400, "Passing marks cannot exceed the exam's total marks.");
    }
  }

  await examModel.updateExamStatus(exam.id, status);
  const updatedExam = await examModel.findExamById(exam.id);
  return success(res, 200, `Exam ${status === "published" ? "published" : "unpublished"} successfully.`, {
    exam: updatedExam,
  });
}

module.exports = { createExam, getMyExams, getExamDetails, updateExam, deleteExam, publishExam };
