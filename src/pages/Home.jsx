import { Link, NavLink, useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpg"; // adjust path
// import QuestionnaireForm from "./QuestionnaireForm";
export default function Home() {
  const navigate = useNavigate();
  // const currentYear = new Date().getFullYear();

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
          backdrop-blur-xl
          rectangle-[40px] shadow-xl
          py-10 text-center mb-20
          w-75vw mx-auto
          "
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-700 tracking-wide">
            የኢኮኖሚ ቤተሰብ ኩነቶች መከታተያ ገጽ / Economy Family Events Mang't Page
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
          <div>
            <h2
              className="text-purple-700 text-2xl content-center md:text-4xl
            px-12 md:px-24 py-6 md:py-10
            rounded-[30px]"
            >
              {" "}
              የማኅበራዊ ትሥሥር ምስረታ ቃለመጠይቅ{" "}
            </h2>
            <button
              onClick={() => navigate("/questionnaire")}
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
              ቃለመጠይቅ ይሙሉ / Fill info
            </button>
          </div>

          <div>
            <h2
              className="text-purple-700 text-2xl content-center md:text-4xl
            px-12 md:px-24 py-6 md:py-10
            rounded-[30px]"
            >
              {" "}
              የክፍያ ደረሰኝ ማረጋገጫ መላኪያ{" "}
            </h2>
            <button
              onClick={() => navigate("/noevent")}
              // /booking
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
              ደረሰኝ እና ቅጽ መላክ / Upload
            </button>
          </div>
          <div>
            <h2
              className="text-purple-700 text-2xl content-center md:text-4xl
            px-12 md:px-24 py-6 md:py-10
            rounded-[30px]"
            >
              {" "}
              አስተዳድር ክፍል{" "}
            </h2>

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
              ወደ አስተዳድር / Manage
            </button>
          </div>
        </div>
        {/* <div>
          <footer className="align-bottom center 10px 4px">
            &copy; {currentYear}{" "}
            <a hrf="https://www.youtube.com/@MuluTilaCodeCamp">
              {" "}
              <button onClick={"https://www.youtube.com/@MuluTilaCodeCamp"}>
                Developer
              </button>{" "}
            </a>{" "}
            . All rights reserved.
          </footer>
        </div> */}
      </div>
    </div>
  );
}
