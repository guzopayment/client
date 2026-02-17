import axios from "axios";

const api = axios.create({
  baseURL: "https://server-y72m.onrender.com/api",
});

api.interceptors.request.use((config) => {
  // Use adminToken for admin endpoints, otherwise normal token
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  const isAdminRequest =
    config.url?.startsWith("/admin") ||
    config.url?.startsWith("/bookings") ||
    config.url?.startsWith("/history") ||
    config.url?.startsWith("/reports");

  const tokenToUse = isAdminRequest ? adminToken : userToken;

  if (tokenToUse) config.headers.Authorization = `Bearer ${tokenToUse}`;
  return config;
});

export default api;
