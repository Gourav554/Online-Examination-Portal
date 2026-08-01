import { useEffect, useState } from "react";
import { getAdminExams, deleteAdminExam, unpublishAdminExam } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import "./AdminPages.css";

function ManageExams() {
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAdminExams()
      .then((res) => setExams(res.data.data.exams))
      .catch(() => setError("Failed to load exams."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUnpublish = async (exam) => {
    try {
      await unpublishAdminExam(exam.id);
      toast("Exam unpublished.");
      load();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to unpublish exam.";
      setError(message);
      toast(message, "error");
    }
  };

  const handleDelete = async (exam) => {
    if (!window.confirm(`Delete "${exam.title}"? This cannot be undone.`)) return;
    try {
      await deleteAdminExam(exam.id);
      toast("Exam removed.");
      load();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete exam.";
      setError(message);
      toast(message, "error");
    }
  };

  return (
    <div>
      <h2>Manage Exams</h2>

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : exams.length === 0 ? (
        <p className="empty-state">No exams have been created yet.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Teacher</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.teacher_name}</td>
                  <td>{exam.duration_minutes} min</td>
                  <td>
                    <span className={`badge ${exam.status === "published" ? "badge-published" : "badge-neutral"}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {exam.status === "published" && (
                        <button className="link-btn" onClick={() => handleUnpublish(exam)}>
                          Unpublish
                        </button>
                      )}
                      <button className="link-btn link-btn-danger" onClick={() => handleDelete(exam)}>
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

export default ManageExams;
