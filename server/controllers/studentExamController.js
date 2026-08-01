const { success, error } = require("../utils/apiResponse");
const examModel = require("../models/examModel");
const submissionModel = require("../models/submissionModel");
const { sendExamConfirmationEmail } = require("../services/emailService");
const {
  buildPaperSnapshot,
  buildQuestionPaper,
  isSubmissionExpired,
  gradeSubmission,
} = require("../services/submissionService");

// GET /api/student/exams
async function getAvailableExams(req, res) {
  const exams = await examModel.findPublishedExamsForStudent(req.user.id);
  return success(res, 200, "Available exams fetched.", { exams });
}

// GET /api/student/exams/:id
async function getExamDetails(req, res) {
  const exam = await examModel.findPublishedExamById(req.params.id);
  if (!exam) {
    return error(res, 404, "Exam not found or not published.");
  }

  const { count, totalMarks } = await examModel.countQuestionsForExam(exam.id);
  const submission = await submissionModel.findSubmissionByExamAndStudent(exam.id, req.user.id);

  return success(res, 200, "Exam details fetched.", {
    exam: { ...exam, question_count: count, total_marks: totalMarks },
    submissionStatus: submission ? submission.status : null,
  });
}

// POST /api/student/exams/:id/start
async function startExam(req, res) {
  const exam = await examModel.findPublishedExamById(req.params.id);
  if (!exam) {
    return error(res, 404, "Exam not found or not published.");
  }

  let submission = await submissionModel.findSubmissionByExamAndStudent(exam.id, req.user.id);

  if (submission && submission.status === "submitted") {
    return error(res, 409, "You have already submitted this exam.");
  }

  if (submission && isSubmissionExpired(submission, exam)) {
    await gradeSubmission(submission, exam);
    return error(res, 409, "Time was up for your previous attempt; it has been auto-submitted.");
  }

  if (!submission) {
    const paperSnapshot = await buildPaperSnapshot(exam);
    const submissionId = await submissionModel.createSubmission({
      examId: exam.id,
      studentId: req.user.id,
      paperSnapshot,
    });
    submission = await submissionModel.findSubmissionById(submissionId);
    await sendExamConfirmationEmail(req.user, exam);
  }

  const questions = await buildQuestionPaper(submission.paper_snapshot, exam.id);
  const elapsedSeconds = Math.floor((Date.now() - new Date(submission.started_at).getTime()) / 1000);
  const remainingSeconds = Math.max(0, exam.duration_minutes * 60 - elapsedSeconds);

  return success(res, 200, "Exam started.", {
    submissionId: submission.id,
    exam: { id: exam.id, title: exam.title, durationMinutes: exam.duration_minutes },
    questions,
    remainingSeconds,
  });
}

module.exports = { getAvailableExams, getExamDetails, startExam };
