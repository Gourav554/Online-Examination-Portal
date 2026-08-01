import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAvailableExams } from "../../api/studentApi";
import { getMyPerformance, getMyResults } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./StudentPages.css";

const statusLabel = {
  in_progress: { text: "In Progress", className: "badge-in-progress" },
  submitted: { text: "Submitted", className: "badge-submitted" },
};

const RECENT_RESULTS_LIMIT = 5;

function StudentDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [exams, setExams] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAvailableExams(), getMyPerformance(), getMyResults()])
      .then(([examsRes, performanceRes, resultsRes]) => {
        setExams(examsRes.data.data.exams);
        setPerformance(performanceRes.data.data.performance);
        setResults(resultsRes.data.data.results);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash === "#available-exams") {
      document.getElementById("available-exams")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, loading]);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  const totalExams = Number(performance.totalExams);
  const passedCount = Number(performance.passedCount);
  const recentResults = results.slice(0, RECENT_RESULTS_LIMIT);

  return (
    <div>
      <div className="page-header">
        <h2>Welcome, {user.name}</h2>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-value">{totalExams}</div>
          <div className="stat-card-label">Exams Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">
            {totalExams === 0 ? "—" : `${Number(performance.averagePercentage).toFixed(1)}%`}
          </div>
          <div className="stat-card-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{passedCount}</div>
          <div className="stat-card-label">Exams Passed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{totalExams === 0 ? "—" : `${((passedCount / totalExams) * 100).toFixed(0)}%`}</div>
          <div className="stat-card-label">Pass Rate</div>
        </div>
      </div>

      <section id="available-exams">
        <div className="page-header">
          <h2>Available Exams</h2>
        </div>

        {exams.length === 0 ? (
          <p className="empty-state">No exams are available right now.</p>
        ) : (
          <div className="exam-card-grid">
            {exams.map((exam) => {
              const status = statusLabel[exam.submission_status];
              const isSubmitted = exam.submission_status === "submitted";
              const buttonLabel = isSubmitted
                ? "View Result"
                : exam.submission_status === "in_progress"
                  ? "Resume Exam"
                  : "Start Exam";
              const buttonTarget = isSubmitted
                ? `/student/results/${exam.submission_id}`
                : `/student/exams/${exam.id}`;

              return (
                <div className="exam-card" key={exam.id}>
                  <h3>{exam.title}</h3>
                  <p>Subject: {exam.subject || "General"}</p>
                  <p>Duration: {exam.duration_minutes} min</p>
                  <p>Questions: {exam.question_count}</p>
                  <p>Total Marks: {exam.total_marks}</p>
                  <p>Passing Marks: {exam.passing_marks}</p>
                  <p>
                    <span className={`badge ${status ? status.className : "badge-not-started"}`}>
                      {status ? status.text : "Not Started"}
                    </span>
                  </p>
                  <Link to={buttonTarget} className="auth-submit-btn btn-sm" style={{ marginTop: 8 }}>
                    {buttonLabel}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="page-header dashboard-section">
        <h2>Recent Results</h2>
        <Link to="/student/results" className="link-btn">
          View All
        </Link>
      </div>

      {recentResults.length === 0 ? (
        <p className="empty-state">You haven't completed any exams yet.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((r) => (
                <tr key={r.id}>
                  <td>{r.exam_title}</td>
                  <td>
                    {r.obtained_marks} / {r.total_marks}
                  </td>
                  <td>
                    <span className={`badge ${r.passed ? "badge-pass" : "badge-fail"}`}>
                      {r.passed ? "Passed" : "Not Passed"}
                    </span>
                  </td>
                  <td>{new Date(r.generated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="page-header dashboard-section">
        <h2>Profile Summary</h2>
        <Link to="/student/profile" className="link-btn">
          View Full Profile
        </Link>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <span>Name</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-row">
          <span>Role</span>
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
