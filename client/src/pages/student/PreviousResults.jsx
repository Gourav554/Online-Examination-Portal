import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyResults, getCertificateDownloadUrl } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./StudentPages.css";

function PreviousResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyResults()
      .then((res) => setResults(res.data.data.results))
      .catch(() => setError("Failed to load results."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Previous Results</h2>

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : results.length === 0 ? (
        <p className="empty-state">You haven't completed any exams yet.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.exam_title}</td>
                  <td>
                    {r.obtained_marks} / {r.total_marks}
                  </td>
                  <td>{Number(r.percentage).toFixed(1)}%</td>
                  <td>
                    <span className={`badge ${r.passed ? "badge-pass" : "badge-fail"}`}>
                      {r.passed ? "Passed" : "Not Passed"}
                    </span>
                  </td>
                  <td>{new Date(r.generated_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/student/results/${r.submission_id}`} className="link-btn">
                      Details
                    </Link>
                    {r.passed && (
                      <>
                        {" | "}
                        <a href={getCertificateDownloadUrl(r.submission_id)} target="_blank" rel="noreferrer" className="link-btn">
                          Certificate
                        </a>
                      </>
                    )}
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

export default PreviousResults;
