const { success, error } = require("../utils/apiResponse");
const submissionModel = require("../models/submissionModel");
const answerModel = require("../models/answerModel");
const questionModel = require("../models/questionModel");
const examModel = require("../models/examModel");
const { isSubmissionExpired, gradeSubmission } = require("../services/submissionService");

// Loads a submission the student owns and confirms it's still active,
// auto-submitting it first if time has already run out.
async function getOwnedInProgressSubmission(submissionId, studentId) {
  const submission = await submissionModel.findSubmissionById(submissionId);
  if (!submission) {
    return { errorMessage: "Submission not found.", statusCode: 404 };
  }
  if (submission.student_id !== studentId) {
    return { errorMessage: "This is not your submission.", statusCode: 403 };
  }
  if (submission.status === "submitted") {
    return { errorMessage: "This exam has already been submitted.", statusCode: 409 };
  }

  const exam = await examModel.findExamById(submission.exam_id);
  if (isSubmissionExpired(submission, exam)) {
    await gradeSubmission(submission, exam);
    return { errorMessage: "Time is up. Your exam has been auto-submitted.", statusCode: 409 };
  }

  return { submission, exam };
}

// POST /api/student/submissions/:id/answers
async function saveAnswer(req, res) {
  const { submission, errorMessage, statusCode } = await getOwnedInProgressSubmission(req.params.id, req.user.id);
  if (errorMessage) {
    return error(res, statusCode, errorMessage);
  }

  const { questionId, answerText } = req.body;
  if (!questionId) {
    return error(res, 400, "questionId is required.");
  }

  const question = await questionModel.findQuestionById(questionId);
  if (!question || question.exam_id !== submission.exam_id) {
    return error(res, 400, "Question does not belong to this exam.");
  }

  await answerModel.upsertAnswer({
    submissionId: submission.id,
    questionId,
    answerText: answerText || null,
  });

  return success(res, 200, "Answer saved.");
}

// POST /api/student/submissions/:id/submit
async function submitExam(req, res) {
  const { submission, exam, errorMessage, statusCode } = await getOwnedInProgressSubmission(
    req.params.id,
    req.user.id
  );
  if (errorMessage) {
    return error(res, statusCode, errorMessage);
  }

  const result = await gradeSubmission(submission, exam);
  return success(res, 200, "Exam submitted successfully.", { result });
}

module.exports = { saveAnswer, submitExam };
