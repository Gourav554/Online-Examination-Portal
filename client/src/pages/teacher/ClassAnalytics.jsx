import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClassAnalytics } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./TeacherPages.css";

function ClassAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getClassAnalytics()
      .then((res) => setAnalytics(res.data.data.analytics))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  return (
    <div>
      <h2>Class Analytics</h2>

      {analytics.length === 0 ? (
        <p className="empty-state">No exam attempts yet across your exams.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Attempts</th>
                <th>Average Score</th>
                <th>Pass Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((row) => {
                const attempts = Number(row.attempts);
                const passRate = attempts > 0 ? Math.round((Number(row.passedCount) / attempts) * 100) : 0;
                return (
                  <tr key={row.exam_id}>
                    <td>{row.exam_title}</td>
                    <td>{attempts}</td>
                    <td>{Number(row.averagePercentage).toFixed(1)}%</td>
                    <td>{passRate}%</td>
                    <td>
                      <Link to={`/teacher/exams/${row.exam_id}/results`} className="link-btn">
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClassAnalytics;
