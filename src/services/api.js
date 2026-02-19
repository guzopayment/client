import axios from "axios";

const api = axios.create({
  baseURL: "https://server-y72m.onrender.com/api",
});

api.interceptors.request.use((config) => {
  // ✅ Use adminToken first, fallback to token
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
