// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "https://server-y72m.onrender.com/api",
  // import.meta.env.VITE_API_URL ||
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
