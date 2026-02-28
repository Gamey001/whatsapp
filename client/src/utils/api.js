import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

// Attach the JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { SERVER_URL };
export default api;
