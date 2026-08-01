import { useEffect, useState } from "react";
import { getAdminCertificates } from "../../api/adminApi";
import Spinner from "../../components/Spinner";
import "./AdminPages.css";

function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminCertificates()
      .then((res) => setCertificates(res.data.data.certificates))
      .catch(() => setError("Failed to load certificates."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="auth-error">{error}</p>;

  return (
    <div>
      <h2>Certificate Management</h2>

      {certificates.length === 0 ? (
        <p className="empty-state">No certificates have been issued yet.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Certificate Code</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id}>
                  <td>{c.student_name}</td>
                  <td>{c.exam_title}</td>
                  <td>{c.certificate_code}</td>
                  <td>{new Date(c.issued_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CertificateManagement;
