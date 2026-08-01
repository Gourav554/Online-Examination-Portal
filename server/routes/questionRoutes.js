const express = require("express");
const router = express.Router();
const { editQuestion, deleteQuestion } = require("../controllers/questionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("teacher"));

router.put("/:id", editQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
