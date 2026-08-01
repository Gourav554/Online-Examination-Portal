import { useEffect, useState } from "react";
import { getStatistics } from "../../api/adminApi";
import Spinner from "../../components/Spinner";
import "./AdminPages.css";

function StatisticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStatistics()
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Failed to load statistics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  return (
    <div>
      <h2>Institution Statistics</h2>
      <p>A platform-wide snapshot of activity across all teachers and students.</p>

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
    </div>
  );
}

export default StatisticsDashboard;
