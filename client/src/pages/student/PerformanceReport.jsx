import { useEffect, useState } from "react";
import { getMyPerformance } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./StudentPages.css";

function PerformanceReport() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyPerformance()
      .then((res) => setPerformance(res.data.data.performance))
      .catch(() => setError("Failed to load performance report."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  const totalExams = Number(performance.totalExams);
  const passedCount = Number(performance.passedCount);

  return (
    <div>
      <h2>Performance Report</h2>

      {totalExams === 0 ? (
        <p className="empty-state">Complete an exam to see your performance report.</p>
      ) : (
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-card-value">{totalExams}</div>
            <div className="stat-card-label">Exams Taken</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{Number(performance.averagePercentage).toFixed(1)}%</div>
            <div className="stat-card-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{passedCount}</div>
            <div className="stat-card-label">Exams Passed</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{((passedCount / totalExams) * 100).toFixed(0)}%</div>
            <div className="stat-card-label">Pass Rate</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceReport;
