import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import Spinner from "./Spinner";

// Shared table for Manage Students / Manage Teachers — same shape, different
// API calls and labels, so it's parameterized instead of duplicated.
function UserManagementTable({ title, dataKey, fetchUsers, deleteUser, roleLabel }) {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetchUsers()
      .then((res) => setUsers(res.data.data[dataKey]))
      .catch(() => setError(`Failed to load ${roleLabel.toLowerCase()}s.`))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}? This cannot be undone.`)) return;
    try {
      await deleteUser(id);
      toast(`${roleLabel} removed.`);
      load();
    } catch (err) {
      const message = err.response?.data?.message || `Failed to remove ${roleLabel.toLowerCase()}.`;
      setError(message);
      toast(message, "error");
    }
  };

  return (
    <div>
      <h2>{title}</h2>

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <p className="empty-state">No {roleLabel.toLowerCase()}s yet.</p>
      ) : (
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="link-btn link-btn-danger" onClick={() => handleDelete(u.id, u.name)}>
                      Remove
                    </button>
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

export default UserManagementTable;
