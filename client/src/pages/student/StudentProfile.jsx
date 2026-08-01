import { useAuth } from "../../context/AuthContext";
import "./StudentPages.css";

function StudentProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-card">
        <div className="profile-row">
          <span>Name</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-row">
          <span>Role</span>
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
