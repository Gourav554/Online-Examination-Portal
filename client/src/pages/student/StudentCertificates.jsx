import { useEffect, useState } from "react";
import { getMyCertificates, getCertificateDownloadUrl } from "../../api/resultApi";
import Spinner from "../../components/Spinner";
import "./StudentPages.css";

function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyCertificates()
      .then((res) => setCertificates(res.data.data.certificates))
      .catch(() => setError("Failed to load certificates."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Certificates</h2>

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : certificates.length === 0 ? (
        <p className="empty-state">Pass an exam to earn your first certificate.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Score</th>
                <th>Certificate Code</th>
                <th>Issued</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.result_id}>
                  <td>{c.exam_title}</td>
                  <td>
                    {c.obtained_marks} / {c.total_marks}
                  </td>
                  <td>{c.certificate_code || "—"}</td>
                  <td>{c.issued_at ? new Date(c.issued_at).toLocaleDateString() : "Not yet generated"}</td>
                  <td>
                    <a
                      href={getCertificateDownloadUrl(c.submission_id)}
                      target="_blank"
                      rel="noreferrer"
                      className="link-btn"
                    >
                      Download
                    </a>
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

export default StudentCertificates;
