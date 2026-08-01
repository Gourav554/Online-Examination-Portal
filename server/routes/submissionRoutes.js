const express = require("express");
const router = express.Router();
const { saveAnswer, submitExam } = require("../controllers/submissionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("student"));

router.post("/:id/answers", saveAnswer);
router.post("/:id/submit", submitExam);

module.exports = router;
