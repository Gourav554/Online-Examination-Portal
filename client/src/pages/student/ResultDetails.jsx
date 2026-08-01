import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResultDetails, getCertificateDownloadUrl } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./StudentPages.css";

function ResultDetails() {
  const { submissionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResultDetails(submissionId)
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load result."))
      .finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;
  if (!data) return null;

  const { exam, result, breakdown } = data;

  return (
    <div>
      <h2>{exam.title} — Result</h2>

      <div className="result-card" style={{ margin: "0 0 24px" }}>
        <div className="result-score">
          {result.obtained_marks} / {result.total_marks}
        </div>
        <p className={result.passed ? "result-pass" : "result-fail"}>{result.passed ? "Passed" : "Not Passed"}</p>
        <p>Percentage: {Number(result.percentage).toFixed(1)}%</p>
        <p>Passing marks: {result.passing_marks}</p>
        {result.passed && (
          <a href={getCertificateDownloadUrl(submissionId)} target="_blank" rel="noreferrer" className="auth-submit-btn" style={{ marginTop: 8 }}>
            Download Certificate
          </a>
        )}
      </div>

      <h3>Question Breakdown</h3>
      {breakdown.map((q, index) => (
        <div className="breakdown-card" key={q.questionId}>
          <p className="breakdown-card-question">
            {index + 1}. {q.questionText}
          </p>
          <div className="breakdown-row">
            <span>Your Answer</span>
            <span>{q.studentAnswer ?? "Not answered"}</span>
          </div>
          {q.questionType !== "descriptive" && (
            <div className="breakdown-row">
              <span>Correct Answer</span>
              <span>{q.correctAnswer}</span>
            </div>
          )}
          <div className="breakdown-row">
            <span>Result</span>
            <span className={q.isCorrect === true ? "breakdown-correct" : q.isCorrect === false ? "breakdown-incorrect" : ""}>
              {q.isCorrect === true ? "Correct" : q.isCorrect === false ? "Incorrect" : "Pending review"} ({q.marksObtained} marks)
            </span>
          </div>
        </div>
      ))}

      <p>
        <Link to="/student/results">Back to Previous Results</Link>
      </p>
    </div>
  );
}

export default ResultDetails;
