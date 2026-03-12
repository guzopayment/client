import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import back from "../assets/home.png";

export default function QuestionnaireForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = async () => {
    try {
      await api.post("/questionnaire", form);

      alert("Submitted successfully");

      setForm({});
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };
  const SUBCITIES = [
    "ልደታ ክ/ከተማ",
    "ቂርቆስ ክ/ከተማ",
    "ጉለሌ ክ/ከተማ",
    "አራዳ ክ/ከተማ",
    "አዲስ ከተማ ክ/ከተማ",
    "ቦሌ ክ/ከተማ",
    "የካ ክ/ከተማ",
    "ንፋስ ስልክ ክ/ከተማ",
    "ቃሊቲ ክ/ከተማ",
    "ለሚኮራ ክ/ከተማ",
  ];
  //  Resgisteration
  const ORGANIZATIONS = [
    "ሐቅዮስ ወተት ወተትና የወተት ውጤቶች ማቀነባበሪያ አማ ",
    "ማቲ ዳቦ እና ኬክ ማምረቻና ማከፋፈያ አማ ",
    "ስምሐን እህል ንግድ አማ ",
    "ሐፊል ትራንስፖርት እና ሎጂስቲክ አማ ",
    "እልፍያ የድቄት ፋብሪካ ",
    "ሎሜዎስ የኅትመት አገልግሎት አማ ",
    "ቅያብ ልብስ ስፌት አማ",
    "ፋኖስ ትምህርትና ሥልጠና አማ ",
    "ሐሉስ አትክልትና ፍራፍሬ ንግድ አማ ",
    "ሁዳሴፍ የሥጋ ዶሮ እንቁላል ምርት አማ ",
    "አንሲፍ ምግብና መጠጥ አማ ",
    "ሲልቫነስ የምግብ ዘይት ፋብሪካ አማ ",
    "ቆሮስ የእንጀራ ምርት አማ ",
    "ቦሎስ የሕንጻ ሥራ ተቋራጭ አማ ",
    "ማማር ቆዳ የቆዳ ውጤቶች ማምረቻ አማ ",
    "ዮልያን የመድኃኒትና የሕክምና መሳሪያዎች አማ ",
    "ማያስ የብሎኬት ማምረቻ ኣማ ",
    "ሐቅያ የካፌና ሬስቶራንት አገልግሎት አማ ",
    "መቅድም የፎቶ ስቱዲዮና ኪነት አቀናጅ አማ",
    "ባዮስ ጠቅላላ የእንጨት ሥራ አማ",
    // add all valid org names here...
  ];
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="text-center">
        <button
          className=" absolute left-1 top-1 w-7 h-10 bg-white text-purple-600
                    px-10 py-3 rounded-xl font-bold
                    shadow hover:scale-105 transition"
        >
          {" "}
          መመለስ
          <img
            src={back}
            alt="back"
            className="w-6 h-6"
            onClick={() => navigate("/")}
          />
        </button>
      </div>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <form
          onSubmit={submitForm}
          className="bg-white p-8 rounded-2xl shadow-lg w-96"
        >
          <h1 className="text-2xl font-bold mb-6">ይህን ቅጽ ሁሉንም በትክክል ይሙሉ</h1>
          <h3 className="text-sm font-thin mb-5 font text-zinc-500">
            ይህ ቅጽ ለማኅበራዊ ጉዳይ አደረጃጀት ልንጠቀመው ስለተፈለገ እባክዎትን ትቂት ግዜ ወስደው በትክክል ይሙሉ!
          </h3>
          {/* <div className=" flex gap-3 grid-cols-3"> */}
          <input
            name="firstName"
            placeholder="የራስ ስም "
            onChange={handleChange}
            className="input border p-3 mb-3 w-full rounded"
          />

          <input
            name="middleName"
            placeholder="የአባት ስም "
            onChange={handleChange}
            className="input border p-3 mb-3 w-full rounded"
          />

          <input
            name="lastName"
            placeholder="የአያት ስም"
            onChange={handleChange}
            className="input border p-3 mb-3 w-full rounded"
          />
          {/* </div> */}
          <input
            name="phone"
            placeholder="📲 ስልክ ቁጥር "
            onChange={handleChange}
            className="input border p-3 w-full rounded"
          />

          <input
            name="altPhone"
            placeholder="📲 ተለዋጭ ስልክ "
            onChange={handleChange}
            className="input border p-3 mb-3 w-full rounded"
          />

          <div className=" flex gap-3 grid-cols-3">
            <select
              name="sex"
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            >
              <option>👤 ፆታ ይምረጡ </option>
              <option>ወንድ </option>
              <option>ሴት </option>
            </select>
            <select
              className="border p-3 mb-3 w-full rounded bg-white"
              value={form.organization}
              onChange={(e) =>
                setForm({ ...form, organization: e.target.value })
              }
            >
              <option value="">
                የቤተሰብ ስም (ድርጅት) ይምረጡ / Select Organization
              </option>
              {ORGANIZATIONS.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>

          <div className=" flex gap-3 grid-cols-3">
            <input
              name="graduatedField"
              placeholder="🧑🏾‍🎓የተመረቁበት የትምርት መስክ "
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            />

            <input
              name="currentJob"
              placeholder="የአሁን ሥራዎት "
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            />
          </div>
          <div className=" flex gap-3 grid-cols-3">
            <select
              className="border p-3 mb-3 w-full rounded bg-white"
              value={form.subcity}
              onChange={(e) => setForm({ ...form, subcity: e.target.value })}
            >
              <option value=""> ክ/ከተማ ስም ይምረጡ / Sub-City</option>
              {SUBCITIES.map((scity) => (
                <option key={scity} value={scity}>
                  {scity}
                </option>
              ))}
            </select>

            <input
              name="woreda"
              placeholder="ወረዳ "
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            />

            <input
              name="kebele"
              placeholder="ቀበሌ"
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            />
          </div>
          <div className=" flex gap-3 grid-cols-3">
            <input
              name="specificPlace"
              placeholder="🏡 የመኖሪያ አካባቢ ልዩ የቦታ ስም "
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            />

            <input
              name="nearChurch"
              placeholder="⛪️ አጥቢያ ቤተክርስቲያን"
              onChange={handleChange}
              className="input border p-3 mb-3 w-full rounded"
            />
          </div>
          <select
            name="houseType"
            onChange={handleChange}
            className="input border p-3 mb-3 w-full rounded"
          >
            {" "}
            <option value="">🏠የቤት ሁኔታ</option>
            <option>የራሴ</option>
            <option>ኪራይ</option>
            <option>ከቤተሰብ ጋር </option>
            <option>አዲስ</option>
          </select>

          <button
            onClick={submitForm}
            className="bg-purple-500 text-white w-full py-3 rounded-lg"
          >
            ያስገቡ/ Submit
          </button>
        </form>
      </div>
    </div>
  );
}
