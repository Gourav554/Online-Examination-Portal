const express = require("express");
const router = express.Router();
const {
  createExam,
  getMyExams,
  getExamDetails,
  updateExam,
  deleteExam,
  publishExam,
} = require("../controllers/examController");
const { addQuestion } = require("../controllers/questionController");
const { getExamResults } = require("../controllers/teacherResultController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("teacher"));

router.post("/", createExam);
router.get("/", getMyExams);
router.get("/:id", getExamDetails);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);
router.patch("/:id/publish", publishExam);
router.post("/:examId/questions", addQuestion);
router.get("/:id/results", getExamResults);

module.exports = router;
