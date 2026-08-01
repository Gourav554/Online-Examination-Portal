require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { testConnection } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");
const studentExamRoutes = require("./routes/studentExamRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/student/exams", studentExamRoutes);
app.use("/api/student/submissions", submissionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testConnection();
});
