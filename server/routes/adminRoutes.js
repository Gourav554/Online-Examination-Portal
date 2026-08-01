const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/statistics", admin.getStatistics);
router.get("/ongoing-exams", admin.getOngoingExams);

router.get("/students", admin.getStudents);
router.delete("/students/:id", admin.deleteStudent);

router.get("/teachers", admin.getTeachers);
router.delete("/teachers/:id", admin.deleteTeacher);

router.get("/exams", admin.getExams);
router.delete("/exams/:id", admin.deleteExam);
router.patch("/exams/:id/unpublish", admin.unpublishExam);

router.get("/certificates", admin.getCertificates);

module.exports = router;
