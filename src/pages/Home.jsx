import { useNavigate } from "react-router-dom";
import bgImage from "../assets/qineeSocialDeputs.jpg";
import clickOn from "../assets/clickOn.gif";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-purple-50/90 backdrop-blur-sm p-6 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto text-center">
          <div className="-mt-36 backdrop-blur-xl shadow-xl py-5 px-3 md:px-5 mb-7 rounded-3xl bg-white/50">
            <h1 className="text-xl md:text-3xl font-bold text-purple-700 tracking-wide leading-tight">
              የቅኔ ኢኮኖሚ ቤተሰብ የማኅበራዊ ጉዳይ በምሥረታ ላይ!!
            </h1>
            <p className="mt-4 text-lg md:text-2xl text-purple-700 font-semibold">
              Qine Economy Family Social Affair on Establishing!
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-full max-w-2xl">
              <h2 className="text-purple-700 text-xl md:text-2xl px-3 py-4 rounded-[30px] font-bold">
                ውድ ቤተሰባችን እንኳን ደኅና መጡ፤ የማኅበራዊ ጉዳይ ትሥሥር ምሥረታ የመጠይቅ ቅጽ ለመሙላት ፥
              </h2>
              {/* <h5> </h5> */}
              <h5 className="text-green-700 text-bold place-items-center">
                ከታች የመጠይቅ ቅጽ ይሙሉ የሚለውን ይንኩ
                <img
                  src={clickOn}
                  alt="Click On "
                  srcset=""
                  className="w-24 h-24 mx-6 "
                />
              </h5>
              <button
                onClick={() => navigate("/questionnaire")}
                className="
                  bg-purple-700
                  text-white text-xl md:text-3xl
                  px-8 md:px-16 py-5 md:py-7
                  rounded-[30px]
                  shadow-lg hover:scale-105 hover:bg-purple-800
                  transition duration-300
                  border border-white/30
                  w-full
                "
              >
                የመጠይቅ ቅጽ ይሙሉ / Fill Form Questionnaire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
