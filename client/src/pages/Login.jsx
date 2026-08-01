import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleSelect from "../components/RoleSelect";
import { getDashboardPath } from "../utils/roleRedirect";
import "./AuthPages.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password, role);
      navigate(getDashboardPath(loggedInUser.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-brand-panel">
        <div className="auth-brand-mark">OE</div>
        <h1 className="auth-brand-title">Online Examination Portal</h1>
        <p className="auth-brand-tagline">Welcome back. Sign in to continue where you left off.</p>
        <ul className="auth-brand-points">
          <li>Secure, role-based exam access</li>
          <li>Instant, accurate results</li>
          <li>Track progress over time</li>
        </ul>
      </aside>

      <div className="auth-form-panel">
        <div className="auth-container">
          <h2 className="auth-title">Login</h2>

          <RoleSelect roles={["admin", "teacher", "student"]} value={role} onChange={setRole} />

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
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
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <br />
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
