import api from "./axios";

// Thin wrappers around the exam/question endpoints, reused across teacher pages.

export const getMyExams = () => api.get("/exams");
export const getExamDetails = (id) => api.get(`/exams/${id}`);
export const createExam = (data) => api.post("/exams", data);
export const updateExam = (id, data) => api.put(`/exams/${id}`, data);
export const deleteExam = (id) => api.delete(`/exams/${id}`);
export const setExamStatus = (id, status) => api.patch(`/exams/${id}/publish`, { status });

export const addQuestion = (examId, data) => api.post(`/exams/${examId}/questions`, data);
export const editQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);
