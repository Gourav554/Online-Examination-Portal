const express = require("express");
const router = express.Router();
const { downloadCertificate, listMyCertificates } = require("../controllers/certificateController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("student"));

router.get("/", listMyCertificates);
router.get("/:submissionId/download", downloadCertificate);

module.exports = router;
