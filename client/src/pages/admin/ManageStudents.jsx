import UserManagementTable from "../../components/UserManagementTable";
import { getStudents, deleteStudent } from "../../api/adminApi";
import "./AdminPages.css";

function ManageStudents() {
  return (
    <UserManagementTable
      title="Manage Students"
      dataKey="students"
      fetchUsers={getStudents}
      deleteUser={deleteStudent}
      roleLabel="Student"
    />
  );
}

export default ManageStudents;
