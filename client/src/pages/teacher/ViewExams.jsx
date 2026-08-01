import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyExams, deleteExam, setExamStatus } from "../../api/examApi";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import "./TeacherPages.css";

function ViewExams() {
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExams = () => {
    setLoading(true);
    getMyExams()
      .then((res) => setExams(res.data.data.exams))
      .catch(() => setError("Failed to load exams."))
      .finally(() => setLoading(false));
  };

  useEffect(loadExams, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam? This cannot be undone.")) return;
    try {
      await deleteExam(id);
      toast("Exam deleted.");
      loadExams();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete exam.";
      setError(message);
      toast(message, "error");
    }
  };

  const handleTogglePublish = async (exam) => {
    try {
      const nextStatus = exam.status === "published" ? "draft" : "published";
      await setExamStatus(exam.id, nextStatus);
      toast(nextStatus === "published" ? "Exam published." : "Exam unpublished.");
      loadExams();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update exam status.";
      setError(message);
      toast(message, "error");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>My Exams</h2>
        <Link to="/teacher/exams/create" className="auth-submit-btn btn-sm">
          + Create Exam
        </Link>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : exams.length === 0 ? (
        <p className="empty-state">No exams yet. Create your first exam to get started.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.duration_minutes} min</td>
                  <td>
                    <span className={`badge ${exam.status === "published" ? "badge-published" : "badge-neutral"}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/teacher/exams/${exam.id}/edit`} className="link-btn">
                        Edit
                      </Link>
                      <Link to={`/teacher/exams/${exam.id}/results`} className="link-btn">
                        Results
                      </Link>
                      <button className="link-btn" onClick={() => handleTogglePublish(exam)}>
                        {exam.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button className="link-btn link-btn-danger" onClick={() => handleDelete(exam.id)}>
                        Delete
                      </button>
                    </div>
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

export default ViewExams;
