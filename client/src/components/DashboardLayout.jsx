import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

// Sidebar + content shell reused by every role that needs sub-navigation
// (Teacher, Admin). Each role's routes pass in their own `links`.
function DashboardLayout({ links }) {
  return (
    <div className="dashboard-layout">
      <Sidebar links={links} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
