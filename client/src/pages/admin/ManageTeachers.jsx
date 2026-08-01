import UserManagementTable from "../../components/UserManagementTable";
import { getTeachers, deleteTeacher } from "../../api/adminApi";
import "./AdminPages.css";

function ManageTeachers() {
  return (
    <UserManagementTable
      title="Manage Teachers"
      dataKey="teachers"
      fetchUsers={getTeachers}
      deleteUser={deleteTeacher}
      roleLabel="Teacher"
    />
  );
}

export default ManageTeachers;
