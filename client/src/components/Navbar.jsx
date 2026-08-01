import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../utils/roleRedirect";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={user ? getDashboardPath(user.role) : "/"} className="navbar-brand">
        Online Examination Portal
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">
              <span className="navbar-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="navbar-user-text">
                {user.name} <span className="navbar-user-role">({user.role})</span>
              </span>
            </span>
            <button className="navbar-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
