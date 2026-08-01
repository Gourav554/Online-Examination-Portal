import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamResults } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./TeacherPages.css";

function StudentResults() {
  const { id } = useParams();
  const [statistics, setStatistics] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExamResults(id)
      .then((res) => {
        setStatistics(res.data.data.statistics);
        setResults(res.data.data.results);
      })
      .catch(() => setError("Failed to load results."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  const attempts = Number(statistics.attempts);

  return (
    <div>
      <h2>Student Results</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-value">{attempts}</div>
          <div className="stat-card-label">Attempts</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{Number(statistics.averagePercentage).toFixed(1)}%</div>
          <div className="stat-card-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{statistics.highestMarks}</div>
          <div className="stat-card-label">Highest Marks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{statistics.lowestMarks}</div>
          <div className="stat-card-label">Lowest Marks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{attempts > 0 ? Math.round((Number(statistics.passedCount) / attempts) * 100) : 0}%</div>
          <div className="stat-card-label">Pass Rate</div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="empty-state">No students have attempted this exam yet.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.student_name}</td>
                  <td>{r.student_email}</td>
                  <td>
                    {r.obtained_marks} / {r.total_marks}
                  </td>
                  <td>{Number(r.percentage).toFixed(1)}%</td>
                  <td>
                    <span className={`badge ${r.passed ? "badge-pass" : "badge-fail"}`}>
                      {r.passed ? "Passed" : "Not Passed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentResults;
