const { success, error } = require("../utils/apiResponse");
const resultModel = require("../models/resultModel");
const submissionModel = require("../models/submissionModel");
const answerModel = require("../models/answerModel");
const questionModel = require("../models/questionModel");
const examModel = require("../models/examModel");

// GET /api/results
async function getMyResults(req, res) {
  const results = await resultModel.findResultsByStudent(req.user.id);
  return success(res, 200, "Results fetched.", { results });
}

// GET /api/results/performance
async function getMyPerformance(req, res) {
  const performance = await resultModel.computeStudentPerformance(req.user.id);
  return success(res, 200, "Performance report fetched.", { performance });
}

// POST /api/results/:submissionId/generate
// Results are created automatically at grading time; this is an idempotent
// fallback for regenerating one on demand if it's ever missing.
async function generateResult(req, res) {
  const submission = await submissionModel.findSubmissionById(req.params.submissionId);
  if (!submission || submission.student_id !== req.user.id) {
    return error(res, 404, "Submission not found.");
  }
  if (submission.status !== "submitted") {
    return error(res, 400, "This exam has not been submitted yet.");
  }

  let result = await resultModel.findResultBySubmissionId(submission.id);
  if (!result) {
    const exam = await examModel.findExamById(submission.exam_id);
    await resultModel.createResult({
      submissionId: submission.id,
      examId: submission.exam_id,
      studentId: submission.student_id,
      studentName: req.user.name,
      examName: exam.title,
      totalMarks: submission.total_marks,
      obtainedMarks: submission.obtained_marks,
      passingMarks: exam.passing_marks,
    });
    result = await resultModel.findResultBySubmissionId(submission.id);
  }

  return success(res, 200, "Result ready.", { result });
}

// GET /api/results/:submissionId
// Accessible to the student who owns it, or the teacher who owns the exam.
async function getResultDetails(req, res) {
  const submission = await submissionModel.findSubmissionById(req.params.submissionId);
  if (!submission) {
    return error(res, 404, "Submission not found.");
  }

  const exam = await examModel.findExamById(submission.exam_id);
  const isOwner = submission.student_id === req.user.id;
  const isExamOwner = req.user.role === "teacher" && exam.teacher_id === req.user.id;

  if (!isOwner && !isExamOwner) {
    return error(res, 403, "You cannot view this result.");
  }
  if (submission.status !== "submitted") {
    return error(res, 400, "This exam has not been submitted yet.");
  }

  const result = await resultModel.findResultBySubmissionId(submission.id);
  const questions = await questionModel.findQuestionsByExam(exam.id);
  const answers = await answerModel.findAnswersBySubmission(submission.id);
  const answerMap = new Map(answers.map((a) => [a.question_id, a]));

  const breakdown = questions.map((q) => {
    const answer = answerMap.get(q.id);
    return {
      questionId: q.id,
      questionText: q.question_text,
      questionType: q.question_type,
      marks: q.marks,
      correctAnswer: q.question_type === "descriptive" ? null : q.correct_answer,
      studentAnswer: answer ? answer.answer_text : null,
      isCorrect: answer ? answer.is_correct : null,
      marksObtained: answer ? answer.marks_obtained : 0,
    };
  });

  return success(res, 200, "Result details fetched.", {
    exam: { id: exam.id, title: exam.title },
    result,
    breakdown,
  });
}

module.exports = { getMyResults, getMyPerformance, generateResult, getResultDetails };
