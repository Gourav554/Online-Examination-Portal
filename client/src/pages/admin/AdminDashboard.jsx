import { useEffect, useState } from "react";
import { getStatistics, getOngoingExams } from "../../api/adminApi";
import Spinner from "../../components/Spinner";
import "./AdminPages.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [ongoing, setOngoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getStatistics(), getOngoingExams()])
      .then(([statsRes, ongoingRes]) => {
        setStats(statsRes.data.data);
        setOngoing(ongoingRes.data.data.ongoing);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-value">{stats.totalStudents}</div>
          <div className="stat-card-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{stats.totalTeachers}</div>
          <div className="stat-card-label">Total Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{stats.totalExams}</div>
          <div className="stat-card-label">Total Exams</div>
        </div>
      </div>

      <h3>Ongoing Exams</h3>
      {ongoing.length === 0 ? (
        <p className="empty-state">No exams are currently in progress.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Duration</th>
                <th>Started</th>
              </tr>
            </thead>
            <tbody>
              {ongoing.map((o) => (
                <tr key={o.id}>
                  <td>{o.student_name}</td>
                  <td>{o.exam_title}</td>
                  <td>{o.duration_minutes} min</td>
                  <td>{new Date(o.started_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
