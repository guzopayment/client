// import { useState } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import back from "../assets/home.png";
// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("adminToken", res.data.token);
//       alert("በተሳካ ሁኔታ መግባት ተችሏል ");
//       console.log(res.data);

//       navigate("/admin-questionnaire");
//     } catch (err) {
//       alert("ለመግባት ውድቅ ሆኗል! ");
//       console.log(err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-200">
//       <div className="text-center">
//         <button
//           type="button"
//           className="absolute left-1 top-1 min-w-fit h-auto bg-white text-purple-600 px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
//           onClick={() => navigate("/")}
//         >
//           መመለስ
//           <img src={back} alt="back" className="w-5 h-5 inline mr-2" />
//         </button>
//       </div>
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-2xl shadow-lg w-80"
//       >
//         <h2 className="text-2xl mb-6 text-center font-bold">
//           ወደ አስተዳድር ሥርዓት መግቢያ{" "}
//         </h2>

//         <input
//           type="email"
//           placeholder="ኢሜይል "
//           className="border p-3 mb-3 w-full rounded"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="የይለፍ ቃል"
//           className="border p-3 mb-5 w-full rounded"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button className="bg-purple-500 text-white w-full py-3 rounded-lg">
//           ግቡ | Login
//         </button>
//         <div className="text-sm text-gray-500 mt-2">
//           {/* * User: "email": "test@gmail.com", "password": "123456" */}
//         </div>
//       </form>
//     </div>
//   );
// }
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import back from "../assets/home.png";
import MessageModal from "../components/MessageModal";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const navigate = useNavigate();

  const showModal = (title, message, type = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      showModal("ማስጠንቀቂያ", "እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ።", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("adminToken", res.data.token);

      showModal("ተሳክቷል", "በተሳካ ሁኔታ መግባት ተችሏል።", "success");

      setTimeout(() => {
        navigate("/admin-questionnaire");
      }, 1000);
    } catch (err) {
      showModal(
        "ማስጠንቀቂያ",
        err.response?.data?.message || "ለመግባት ውድቅ ሆኗል!",
        "error",
      );
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200 px-4">
      <div className="text-center">
        <button
          type="button"
          className="absolute left-1 top-1 min-w-fit h-auto bg-white text-purple-600 px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
          onClick={() => navigate("/")}
        >
          መመለስ
          <img src={back} alt="back" className="w-5 h-5 inline mr-2" />
        </button>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">
          ወደ አስተዳድር ሥርዓት መግቢያ
        </h2>

        <input
          type="email"
          placeholder="ኢሜይል"
          className="border p-3 mb-3 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="የይለፍ ቃል"
          className="border p-3 mb-5 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-500 text-white w-full py-3 rounded-lg hover:bg-purple-600 transition disabled:opacity-60"
        >
          {loading ? "በመግባት ላይ..." : "ግቡ | Login"}
        </button>
      </form>

      <MessageModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
