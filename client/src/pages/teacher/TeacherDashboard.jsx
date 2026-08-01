import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyExams } from "../../api/examApi";
import Spinner from "../../components/Spinner";
import "./TeacherPages.css";

function TeacherDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyExams()
      .then((res) => setExams(res.data.data.exams))
      .finally(() => setLoading(false));
  }, []);

  const published = exams.filter((e) => e.status === "published").length;

  return (
    <div>
      <div className="page-header">
        <h2>Welcome, {user.name}</h2>
        <Link to="/teacher/exams/create" className="auth-submit-btn btn-sm">
          + Create Exam
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-card-value">{exams.length}</div>
            <div className="stat-card-label">Total Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{published}</div>
            <div className="stat-card-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{exams.length - published}</div>
            <div className="stat-card-label">Drafts</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
