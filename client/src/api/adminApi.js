import api from "./axios";

export const getStatistics = () => api.get("/admin/statistics");
export const getOngoingExams = () => api.get("/admin/ongoing-exams");

export const getStudents = () => api.get("/admin/students");
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);

export const getTeachers = () => api.get("/admin/teachers");
export const deleteTeacher = (id) => api.delete(`/admin/teachers/${id}`);

export const getAdminExams = () => api.get("/admin/exams");
export const deleteAdminExam = (id) => api.delete(`/admin/exams/${id}`);
export const unpublishAdminExam = (id) => api.patch(`/admin/exams/${id}/unpublish`);

export const getAdminCertificates = () => api.get("/admin/certificates");




