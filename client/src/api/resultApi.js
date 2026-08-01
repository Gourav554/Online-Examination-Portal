import api from "./axios";

// Thin wrappers around the result endpoints (student side).

export const getMyResults = () => api.get("/results");
export const getMyPerformance = () => api.get("/results/performance");
export const getResultDetails = (submissionId) => api.get(`/results/${submissionId}`);

// Certificate downloads are a plain browser navigation (not an axios call) so the
// httpOnly auth cookie is sent automatically; this just builds the target URL.
export const getCertificateDownloadUrl = (submissionId) =>
  `${api.defaults.baseURL}/certificates/${submissionId}/download`;

export const getMyCertificates = () => api.get("/certificates");

// Teacher-side result endpoints.
export const getExamResults = (examId) => api.get(`/exams/${examId}/results`);
export const getClassAnalytics = () => api.get("/teacher/analytics");
