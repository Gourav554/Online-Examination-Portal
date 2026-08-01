const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");
const submissionModel = require("../models/submissionModel");
const resultModel = require("../models/resultModel");
const userModel = require("../models/userModel");
const { sendResultEmail } = require("./emailService");

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Builds the question/option order shown to a student for a fresh attempt.
// Stored on the submission so a page refresh doesn't reshuffle mid-exam.
async function buildPaperSnapshot(exam) {
  let questions = await questionModel.findQuestionsByExam(exam.id);
  if (exam.randomize_questions) {
    questions = shuffle(questions);
  }

  return questions.map((q) => ({
    question_id: q.id,
    options: q.question_type === "mcq" ? (exam.randomize_options ? shuffle(q.options) : q.options) : undefined,
  }));
}

// Joins a stored paper snapshot with live question text/marks, hiding correct answers.
async function buildQuestionPaper(paperSnapshot, examId) {
  const questions = await questionModel.findQuestionsByExam(examId);
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  return paperSnapshot
    .map((entry) => {
      const question = questionMap.get(entry.question_id);
      if (!question) return null;
      return {
        id: question.id,
        question_text: question.question_text,
        question_type: question.question_type,
        marks: question.marks,
        options: entry.options,
      };
    })
    .filter(Boolean);
}

function isSubmissionExpired(submission, exam) {
  const elapsedMs = Date.now() - new Date(submission.started_at).getTime();
  return elapsedMs >= exam.duration_minutes * 60 * 1000;
}

// Grades every question in the exam and finalizes the submission.
// Used by both the explicit "Submit" action and the server-side auto-submit safety net.
async function gradeSubmission(submission, exam) {
  const questions = await questionModel.findQuestionsByExam(exam.id);
  const answers = await answerModel.findAnswersBySubmission(submission.id);
  const answerMap = new Map(answers.map((a) => [a.question_id, a.answer_text]));

  let totalMarks = 0;
  let obtainedMarks = 0;

  for (const question of questions) {
    totalMarks += question.marks;
    const answerText = answerMap.get(question.id) ?? null;

    let isCorrect = null;
    let marksObtained = 0;

    if (question.question_type !== "descriptive" && answerText) {
      isCorrect = answerText === question.correct_answer;
      marksObtained = isCorrect ? question.marks : -Number(exam.negative_marks);
    }

    obtainedMarks += marksObtained;
    await answerModel.upsertGradedAnswer({
      submissionId: submission.id,
      questionId: question.id,
      answerText,
      isCorrect,
      marksObtained,
    });
  }

  obtainedMarks = Math.max(0, obtainedMarks);
  await submissionModel.finalizeSubmission(submission.id, { totalMarks, obtainedMarks });

  const student = await userModel.findUserById(submission.student_id);

  // Automatic evaluation: persist the graded result as soon as grading finishes.
  await resultModel.createResult({
    submissionId: submission.id,
    examId: exam.id,
    studentId: submission.student_id,
    studentName: student ? student.name : null,
    examName: exam.title,
    totalMarks,
    obtainedMarks,
    passingMarks: exam.passing_marks,
  });

  const result = {
    totalMarks,
    obtainedMarks,
    passingMarks: exam.passing_marks,
    passed: obtainedMarks >= exam.passing_marks,
  };

  if (student) {
    await sendResultEmail(student, exam, result);
  }

  return result;
}

module.exports = { buildPaperSnapshot, buildQuestionPaper, isSubmissionExpired, gradeSubmission };
