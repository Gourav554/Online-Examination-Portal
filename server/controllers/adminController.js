const { success, error } = require("../utils/apiResponse");
const userModel = require("../models/userModel");
const examModel = require("../models/examModel");
const certificateModel = require("../models/certificateModel");
const submissionModel = require("../models/submissionModel");

// GET /api/admin/statistics
async function getStatistics(req, res) {
  const [totalStudents, totalTeachers, totalExams] = await Promise.all([
    userModel.countByRole("student"),
    userModel.countByRole("teacher"),
    examModel.countAllExams(),
  ]);

  return success(res, 200, "Statistics fetched.", { totalStudents, totalTeachers, totalExams });
}

// GET /api/admin/ongoing-exams
async function getOngoingExams(req, res) {
  const ongoing = await submissionModel.findOngoingSubmissions();
  return success(res, 200, "Ongoing exams fetched.", { ongoing });
}

// GET /api/admin/students
async function getStudents(req, res) {
  const students = await userModel.findUsersByRole("student");
  return success(res, 200, "Students fetched.", { students });
}

// DELETE /api/admin/students/:id
async function deleteStudent(req, res) {
  const user = await userModel.findUserById(req.params.id);
  if (!user || user.role !== "student") {
    return error(res, 404, "Student not found.");
  }
  await userModel.deleteUser(req.params.id);
  return success(res, 200, "Student removed.");
}

// GET /api/admin/teachers
async function getTeachers(req, res) {
  const teachers = await userModel.findUsersByRole("teacher");
  return success(res, 200, "Teachers fetched.", { teachers });
}

// DELETE /api/admin/teachers/:id
async function deleteTeacher(req, res) {
  const user = await userModel.findUserById(req.params.id);
  if (!user || user.role !== "teacher") {
    return error(res, 404, "Teacher not found.");
  }
  await userModel.deleteUser(req.params.id);
  return success(res, 200, "Teacher removed.");
}

// GET /api/admin/exams
async function getExams(req, res) {
  const exams = await examModel.findAllExamsForAdmin();
  return success(res, 200, "Exams fetched.", { exams });
}

// DELETE /api/admin/exams/:id
async function deleteExam(req, res) {
  const exam = await examModel.findExamById(req.params.id);
  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  await examModel.deleteExam(req.params.id);
  return success(res, 200, "Exam removed.");
}

// PATCH /api/admin/exams/:id/unpublish
async function unpublishExam(req, res) {
  const exam = await examModel.findExamById(req.params.id);
  if (!exam) {
    return error(res, 404, "Exam not found.");
  }
  await examModel.updateExamStatus(req.params.id, "draft");
  return success(res, 200, "Exam unpublished.");
}

// GET /api/admin/certificates
async function getCertificates(req, res) {
  const certificates = await certificateModel.findAllCertificates();
  return success(res, 200, "Certificates fetched.", { certificates });
}

module.exports = {
  getStatistics,
  getOngoingExams,
  getStudents,
  deleteStudent,
  getTeachers,
  deleteTeacher,
  getExams,
  deleteExam,
  unpublishExam,
  getCertificates,
};
