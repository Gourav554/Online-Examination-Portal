const crypto = require("crypto");
const { success, error } = require("../utils/apiResponse");
const submissionModel = require("../models/submissionModel");
const resultModel = require("../models/resultModel");
const certificateModel = require("../models/certificateModel");
const examModel = require("../models/examModel");
const { buildCertificatePdf } = require("../services/certificateService");

// GET /api/certificates/:submissionId/download
async function downloadCertificate(req, res) {
  const submission = await submissionModel.findSubmissionById(req.params.submissionId);
  if (!submission || submission.student_id !== req.user.id) {
    return error(res, 404, "Submission not found.");
  }
  if (submission.status !== "submitted") {
    return error(res, 400, "This exam has not been submitted yet.");
  }

  const result = await resultModel.findResultBySubmissionId(submission.id);
  if (!result || !result.passed) {
    return error(res, 403, "A certificate is only available for a passed exam.");
  }

  const exam = await examModel.findExamById(submission.exam_id);

  let certificate = await certificateModel.findCertificateByResultId(result.id);
  if (!certificate) {
    const certificateCode = crypto.randomBytes(8).toString("hex").toUpperCase();
    await certificateModel.createCertificate({
      resultId: result.id,
      certificateCode,
      studentId: req.user.id,
      studentName: req.user.name,
      examId: exam.id,
      examName: exam.title,
      score: result.obtained_marks,
    });
    certificate = await certificateModel.findCertificateByResultId(result.id);
  }

  const pdfBuffer = await buildCertificatePdf({
    studentName: req.user.name,
    examTitle: exam.title,
    obtainedMarks: result.obtained_marks,
    totalMarks: result.total_marks,
    issuedAt: certificate.issued_at,
    certificateCode: certificate.certificate_code,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="certificate-${exam.title.replace(/\s+/g, "_")}.pdf"`,
  });
  res.send(pdfBuffer);
}

// GET /api/certificates
async function listMyCertificates(req, res) {
  const certificates = await certificateModel.findCertificateEligibleResultsByStudent(req.user.id);
  return success(res, 200, "Certificates fetched.", { certificates });
}

module.exports = { downloadCertificate, listMyCertificates };













