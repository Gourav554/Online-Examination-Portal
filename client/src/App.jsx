import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ViewExams from "./pages/teacher/ViewExams";
import CreateExam from "./pages/teacher/CreateExam";
import EditExam from "./pages/teacher/EditExam";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import StudentResults from "./pages/teacher/StudentResults";
import ClassAnalytics from "./pages/teacher/ClassAnalytics";
import StudentDashboard from "./pages/student/StudentDashboard";
import ExamDetails from "./pages/student/ExamDetails";
import TakeExam from "./pages/student/TakeExam";
import PreviousResults from "./pages/student/PreviousResults";
import ResultDetails from "./pages/student/ResultDetails";
import PerformanceReport from "./pages/student/PerformanceReport";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentProfile from "./pages/student/StudentProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageExams from "./pages/admin/ManageExams";
import CertificateManagement from "./pages/admin/CertificateManagement";
import StatisticsDashboard from "./pages/admin/StatisticsDashboard";

const teacherLinks = [
  { to: "/teacher", label: "Dashboard", end: true },
  { to: "/teacher/exams", label: "My Exams" },
  { to: "/teacher/exams/create", label: "Create Exam" },
  { to: "/teacher/analytics", label: "Class Analytics" },
  { to: "/teacher/profile", label: "Profile" },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/students", label: "Manage Students" },
  { to: "/admin/teachers", label: "Manage Teachers" },
  { to: "/admin/exams", label: "Manage Exams" },
  { to: "/admin/certificates", label: "Certificate Management" },
  { to: "/admin/statistics", label: "Statistics" },
];

const studentLinks = [
  { to: "/student", label: "Dashboard", end: true },
  { to: "/student", hash: "#available-exams", label: "Available Exams" },
  { to: "/student/results", label: "Results" },
  { to: "/student/certificates", label: "Certificates" },
  { to: "/student/profile", label: "Profile" },
  { label: "Logout", action: "logout" },
];

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <DashboardLayout links={teacherLinks} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TeacherDashboard />} />
                <Route path="exams" element={<ViewExams />} />
                <Route path="exams/create" element={<CreateExam />} />
                <Route path="exams/:id/edit" element={<EditExam />} />
                <Route path="exams/:id/results" element={<StudentResults />} />
                <Route path="analytics" element={<ClassAnalytics />} />
                <Route path="profile" element={<TeacherProfile />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout links={adminLinks} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="teachers" element={<ManageTeachers />} />
                <Route path="exams" element={<ManageExams />} />
                <Route path="certificates" element={<CertificateManagement />} />
                <Route path="statistics" element={<StatisticsDashboard />} />
              </Route>

              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <DashboardLayout links={studentLinks} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="exams/:id" element={<ExamDetails />} />
                <Route path="exams/:id/attempt" element={<TakeExam />} />
                <Route path="results" element={<PreviousResults />} />
                <Route path="results/:submissionId" element={<ResultDetails />} />
                <Route path="performance" element={<PerformanceReport />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>
            </Routes>
          </main>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
