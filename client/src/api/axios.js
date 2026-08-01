import axios from "axios";

// Central axios instance used by the whole app.
// withCredentials lets the browser send/receive the httpOnly JWT cookie.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
