const { success, error } = require("../utils/apiResponse");
const examModel = require("../models/examModel");
const resultModel = require("../models/resultModel");

// GET /api/exams/:id/results
async function getExamResults(req, res) {
  const exam = await examModel.findExamById(req.params.id);
  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  if (exam.teacher_id !== req.user.id) {
    return error(res, 403, "You do not own this exam.");
  }

  const statistics = await resultModel.computeExamStatistics(exam.id);
  const results = await resultModel.findResultsByExam(exam.id);

  return success(res, 200, "Exam results fetched.", { statistics, results });
}

// GET /api/teacher/analytics
async function getClassAnalytics(req, res) {
  const analytics = await resultModel.findAllResultsForTeacher(req.user.id);
  return success(res, 200, "Class analytics fetched.", { analytics });
}

module.exports = { getExamResults, getClassAnalytics };
