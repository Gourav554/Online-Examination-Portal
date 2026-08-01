const express = require("express");
const router = express.Router();
const { getMyResults, getMyPerformance, generateResult, getResultDetails } = require("../controllers/resultController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", authorize("student"), getMyResults);
router.get("/performance", authorize("student"), getMyPerformance);
router.post("/:submissionId/generate", authorize("student"), generateResult);
// Owner check (student or the exam's teacher) happens inside the controller.
router.get("/:submissionId", getResultDetails);

module.exports = router;
