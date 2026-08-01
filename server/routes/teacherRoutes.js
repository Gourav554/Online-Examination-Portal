const express = require("express");
const router = express.Router();
const { getClassAnalytics } = require("../controllers/teacherResultController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("teacher"));

router.get("/analytics", getClassAnalytics);

module.exports = router;
