import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import back from "../assets/home.png";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      alert("Login Successful");
      console.log(res.data);

      navigate("/admin-dashboard");
    } catch (err) {
      alert("Login failed");
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="text-center">
        <button
          className=" absolute left-4 top-4 bg-white text-purple-600
                      px-10 py-3 rounded-xl font-bold
                      shadow hover:scale-105 transition"
        >
          <img
            src={back}
            alt="back"
            className="w-6 h-6"
            onClick={() => navigate("/")}
          />
        </button>
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">
          ወደ አስተዳድር መግቢያ ሥርዓት{" "}
        </h2>

        <input
          placeholder="Email"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 mb-5 w-full rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-purple-500 text-white w-full py-3 rounded-lg">
          Login
        </button>
        <div className="text-sm text-gray-500 mt-2">
          {/* * User: "email": "test@gmail.com", "password": "123456" */}
        </div>
      </form>
    </div>
  );
}
