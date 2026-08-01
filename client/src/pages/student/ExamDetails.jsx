import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getExamDetails } from "../../api/studentApi";
import Spinner from "../../components/Spinner";
import "./StudentPages.css";

function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExamDetails(id)
      .then((res) => {
        const data = res.data.data;
        setExam(data.exam);
        setSubmissionStatus(data.submissionStatus);
      })
      .catch(() => setError("Exam not found or not available."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;
  if (!exam) return null;

  return (
    <div>
      <h2>{exam.title}</h2>
      {exam.description && <p>{exam.description}</p>}

      <div className="exam-detail-card">
        <div className="exam-detail-row">
          <span>Duration</span>
          <span>{exam.duration_minutes} minutes</span>
        </div>
        <div className="exam-detail-row">
          <span>Questions</span>
          <span>{exam.question_count}</span>
        </div>
        <div className="exam-detail-row">
          <span>Total Marks</span>
          <span>{exam.total_marks}</span>
        </div>
        <div className="exam-detail-row">
          <span>Passing Marks</span>
          <span>{exam.passing_marks}</span>
        </div>
        <div className="exam-detail-row">
          <span>Negative Marking</span>
          <span>{Number(exam.negative_marks) > 0 ? `-${exam.negative_marks} per wrong answer` : "None"}</span>
        </div>

        {submissionStatus === "submitted" ? (
          <p style={{ marginTop: 16 }} className="badge badge-submitted">
            You have already submitted this exam.
          </p>
        ) : (
          <button
            className="auth-submit-btn"
            style={{ marginTop: 16 }}
            onClick={() => navigate(`/student/exams/${id}/attempt`)}
          >
            {submissionStatus === "in_progress" ? "Resume Exam" : "Start Exam"}
          </button>
        )}
      </div>

      <p style={{ marginTop: 16 }}>
        <Link to="/student#available-exams">Back to Available Exams</Link>
      </p>
    </div>
  );
}

export default ExamDetails;
