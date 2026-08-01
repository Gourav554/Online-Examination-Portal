import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { startExam, saveAnswer, submitExam } from "../../api/studentApi";
import { getCertificateDownloadUrl } from "../../api/resultApi";
import Timer from "../../components/Timer";
import Spinner from "../../components/Spinner";
import { useToast } from "../../context/ToastContext";
import "./StudentPages.css";

function TakeExam() {
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionId, setSubmissionId] = useState(null);
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    startExam(id)
      .then((res) => {
        const data = res.data.data;
        setSubmissionId(data.submissionId);
        setExamTitle(data.exam.title);
        setQuestions(data.questions);
        setRemainingSeconds(data.remainingSeconds);
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to start this exam."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    saveAnswer(submissionId, questionId, value).catch(() => {
      // Non-blocking: the answer stays in local state and will be resent on next change/submit.
    });
  };

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (!isAutoSubmit && !window.confirm("Submit the exam now?")) return;

      setSubmitting(true);
      try {
        const res = await submitExam(submissionId);
        setResult(res.data.data.result);
        toast(isAutoSubmit ? "Time's up — exam auto-submitted." : "Exam submitted.");
      } catch (err) {
        const message = err.response?.data?.message || "Failed to submit exam.";
        setError(message);
        toast(message, "error");
      } finally {
        setSubmitting(false);
      }
    },
    [submissionId, toast]
  );

  if (loading) return <Spinner />;

  if (error && !result) {
    return (
      <div>
        <p className="auth-error">{error}</p>
        <Link to="/student#available-exams">Back to Available Exams</Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="result-card">
        <h2>Exam Submitted</h2>
        <div className="result-score">
          {result.obtainedMarks} / {result.totalMarks}
        </div>
        <p className={result.passed ? "result-pass" : "result-fail"}>{result.passed ? "Passed" : "Not Passed"}</p>
        <p>Passing marks: {result.passingMarks}</p>
        {result.passed && (
          <p>
            <a href={getCertificateDownloadUrl(submissionId)} target="_blank" rel="noreferrer" className="auth-submit-btn">
              Download Certificate
            </a>
          </p>
        )}
        <p>
          <Link to={`/student/results/${submissionId}`}>View Full Result Details</Link>
          {" | "}
          <Link to="/student#available-exams">Back to Available Exams</Link>
        </p>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div>
      <div className="take-exam-header">
        <h3 style={{ margin: 0 }}>{examTitle}</h3>
        <Timer initialSeconds={remainingSeconds} onExpire={() => handleSubmit(true)} />
        <button className="auth-submit-btn btn-sm" disabled={submitting} onClick={() => handleSubmit(false)}>
          {submitting ? "Submitting..." : "Submit Exam"}
        </button>
      </div>

      <div className="take-exam-body">
        <div className="question-palette">
          {questions.map((q, index) => (
            <button
              key={q.id}
              className={`palette-btn ${answers[q.id] ? "palette-btn-answered" : ""} ${
                index === currentIndex ? "palette-btn-current" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="question-panel">
          <h3>
            Question {currentIndex + 1} of {questions.length} ({question.marks} mark
            {question.marks > 1 ? "s" : ""})
          </h3>
          <p>{question.question_text}</p>

          {question.question_type === "mcq" &&
            question.options.map((option) => (
              <label className="answer-option" key={option}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                />
                {option}
              </label>
            ))}

          {question.question_type === "true_false" && (
            <>
              <label className="answer-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === "true"}
                  onChange={() => handleAnswerChange(question.id, "true")}
                />
                True
              </label>
              <label className="answer-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === "false"}
                  onChange={() => handleAnswerChange(question.id, "false")}
                />
                False
              </label>
            </>
          )}

          {question.question_type === "descriptive" && (
            <textarea
              className="descriptive-answer"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Write your answer here..."
            />
          )}

          <div className="question-nav-actions">
            <button
              className="btn-secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Previous
            </button>
            <button
              className="btn-secondary"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeExam;
