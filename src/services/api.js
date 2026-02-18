import axios from "axios";

const api = axios.create({
  baseURL: "https://server-y72m.onrender.com/api",
});

api.interceptors.request.use((config) => {
  // ✅ Prefer adminToken, fallback to token
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");
  const token = adminToken || userToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
