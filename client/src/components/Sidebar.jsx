import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

// Generic sidebar nav, reused by every role's layout (see DashboardLayout).
// A link may optionally set `hash` (in-page anchor, never shown as active) or
// `action: "logout"` (renders as a button that logs out instead of navigating).
function Sidebar({ links }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <nav>
        {links.map((link) =>
          link.action === "logout" ? (
            <button key="logout" type="button" className="sidebar-link sidebar-link-logout" onClick={handleLogout}>
              {link.label}
            </button>
          ) : (
            <NavLink
              key={link.to + (link.hash || "")}
              to={link.hash ? `${link.to}${link.hash}` : link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link ${isActive && !link.hash ? "sidebar-link-active" : ""}`}
            >
              {link.label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
