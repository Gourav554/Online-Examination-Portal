import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleSelect from "../components/RoleSelect";
import { getDashboardPath } from "../utils/roleRedirect";
import "./AuthPages.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const registeredUser = await register({ name, email, password, role });
      navigate(getDashboardPath(registeredUser.role));
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-brand-panel">
        <div className="auth-brand-mark">OE</div>
        <h1 className="auth-brand-title">Online Examination Portal</h1>
        <p className="auth-brand-tagline">Create an account to start taking or managing exams.</p>
        <ul className="auth-brand-points">
          <li>Set up in under a minute</li>
          <li>Built for students &amp; teachers</li>
          <li>Your data stays secure</li>
        </ul>
      </aside>

      <div className="auth-form-panel">
        <div className="auth-container">
          <h2 className="auth-title">Register</h2>

          {/* Admin accounts are created separately by the institution, not via public signup */}
          <RoleSelect roles={["student", "teacher"]} value={role} onChange={setRole} />

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="auth-links">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
