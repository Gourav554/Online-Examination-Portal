import "./RoleSelect.css";

// Reusable role tab-selector used on the Login and Register pages.
// `roles` controls which options are shown (Register excludes "admin").
function RoleSelect({ roles, value, onChange }) {
  return (
    <div className="role-select">
      {roles.map((role) => (
        <button
          type="button"
          key={role}
          className={`role-option ${value === role ? "role-option-active" : ""}`}
          onClick={() => onChange(role)}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default RoleSelect;
