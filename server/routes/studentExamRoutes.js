const express = require("express");
const router = express.Router();
const { getAvailableExams, getExamDetails, startExam } = require("../controllers/studentExamController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("student"));

router.get("/", getAvailableExams);
router.get("/:id", getExamDetails);
router.post("/:id/start", startExam);

module.exports = router;
