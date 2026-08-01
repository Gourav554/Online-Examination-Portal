import api from "./axios";

// Thin wrappers around the student-facing exam endpoints.

export const getAvailableExams = () => api.get("/student/exams");
export const getExamDetails = (id) => api.get(`/student/exams/${id}`);
export const startExam = (id) => api.post(`/student/exams/${id}/start`);
export const saveAnswer = (submissionId, questionId, answerText) =>
  api.post(`/student/submissions/${submissionId}/answers`, { questionId, answerText });
export const submitExam = (submissionId) => api.post(`/student/submissions/${submissionId}/submit`);
