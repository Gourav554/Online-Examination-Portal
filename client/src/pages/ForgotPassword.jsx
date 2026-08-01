import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./AuthPages.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-brand-panel">
        <div className="auth-brand-mark">OE</div>
        <h1 className="auth-brand-title">Online Examination Portal</h1>
        <p className="auth-brand-tagline">Forgot your password? We'll help you get back in.</p>
        <ul className="auth-brand-points">
          <li>Reset link sent to your email</li>
          <li>Secure, one-time link</li>
          <li>Back to your dashboard in seconds</li>
        </ul>
      </aside>

      <div className="auth-form-panel">
        <div className="auth-container">
          <h2 className="auth-title">Forgot Password</h2>

          {message && <div className="auth-success">{message}</div>}
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Registered Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
