import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpg"; // adjust path

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay (dark blur for readability) */}
      <div className="min-h-screen bg-purple-50 backdrop-blur-sm p-6">
        {/* Header Glass Card */}
        <div
          className="
          bg-purple-600 backdrop-blur-xl
          rounded-[40px] shadow-xl
          py-10 text-center mb-20
          max-w-4xl mx-auto
          "
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide">
            የቤተሰብ ጉዞ አስትድር ክፍያ መቀበያ እና ቅጽ መሙያ / Guzo Management
          </h1>
        </div>

        {/* Buttons */}
        <div
          className="
          flex flex-col md:flex-row
          gap-8 md:gap-20
          justify-center items-center mt-10
          "
        >
          <button
            onClick={() => navigate("/booking")}
            className="
            bg-purple-700 backdrop-blur-xl
            text-white text-2xl md:text-4xl
            px-12 md:px-24 py-6 md:py-10
            rounded-[30px]
            shadow-lg hover:scale-105
            transition duration-300
            border border-white/30
            "
          >
            የክፍያ ደረሰኝ እዚህ እና ቅጽ በዚህ ይላኩ/ Upload
          </button>

          <button
            onClick={() => navigate("/admin-login")}
            className="
            bg-purple-700 backdrop-blur-xl
            text-white text-2xl md:text-4xl
            px-12 md:px-24 py-6 md:py-10
            rounded-[30px]
            shadow-lg hover:scale-105
            transition duration-300
            border border-white/30
            "
          >
            ለአስትዳድር ክፍል ብቻ የይለፍ ቃልና ኢሜይል ይጠየቃሉ / Manage
          </button>
        </div>
      </div>
    </div>
  );
}
