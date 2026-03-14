import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import back from "../assets/home.png";
import MessageModal from "../components/MessageModal";

export default function QuestionnaireForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    altPhone: "",
    organization: "",
    sex: "",
    graduatedField: "",
    currentJob: "",
    subCity: "",
    woreda: "",
    kebele: "",
    specificPlace: "",
    nearChurch: "",
    houseType: "",
  });

  const [customGraduatedField, setCustomGraduatedField] = useState("");
  const [customCurrentJob, setCustomCurrentJob] = useState("");
  const [customSubCity, setCustomeSubCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const showModal = (title, message, type = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const GRADUATED_FIELDS = [
    "ማኔጅመንት",
    "አካውንቲንግ",
    "ማርኬቲንግ",
    "ኢኮኖሚክስ",
    "ህግ",
    "ኮምፒውተር ሳይንስ",
    "ኢንጅነሪንግ",
    "ጤና",
    "ትምህርት",
    "ሌላ",
  ];

  const CURRENT_JOBS = [
    "ተማሪ",
    "ሰራተኛ",
    "ነጋዴ",
    "የራሴን የምሰራ",
    "ስራ ፈላጊ",
    "የቤት እመቤት",
    "ሌላ",
  ];

  const SEX_OPTIONS = ["ወንድ", "ሴት"];
  const HOUSE_TYPES = ["የራሴ", "ኪራይ", "ከቤተሰብ ጋር", "አዲስ"];

  const SUBCITIES = [
    "ልደታ ክፍለ ከተማ",
    "ቂርቆስ ክፍለ ከተማ",
    "ጉለሌ ክፍለ ከተማ",
    "አራዳ ክፍለ ከተማ",
    "አዲስ ከተማ ክፍለ ከተማ",
    "ቦሌ ክፍለ ከተማ",
    "የካ ክፍለ ከተማ",
    "ንፋስ ስልክ ክፍለ ከተማ",
    "ቃሊቲ ክፍለ ከተማ",
    "ለሚኮራ ክፍለ ከተማ",
    "ኮልፌ ቀራኒዮ ክፍለ ከተማ",
    "ሌላ",
  ];

  const ORGANIZATIONS = [
    "ሐቅዮስ ወተት ወተትና የወተት ውጤቶች ማቀነባበሪያ አማ",
    "ማቲ ዳቦ እና ኬክ ማምረቻና ማከፋፈያ አማ",
    "ስምሐን እህል ንግድ አማ",
    "ሐፊል ትራንስፖርት እና ሎጂስቲክ አማ",
    "እልፍያ የድቄት ፋብሪካ",
    "ሎሜዎስ የኅትመት አገልግሎት አማ",
    "ቅያብ ልብስ ስፌት አማ",
    "ፋኖስ ትምህርትና ሥልጠና አማ",
    "ሐሉስ አትክልትና ፍራፍሬ ንግድ አማ",
    "ሁዳሴፍ የሥጋ ዶሮ እንቁላል ምርት አማ",
    "አንሲፍ ምግብና መጠጥ አማ",
    "ሲልቫነስ የምግብ ዘይት ፋብሪካ አማ",
    "ቆሮስ የእንጀራ ምርት ማምረቻና ማከፋፈያአማ",
    "ቦሎስ የሕንጻ ሥራ ተቋራጭ አማ",
    "ሀቅማት የእህል ወፍ ቤትና የዱቄት  ማምረቻና ማከፋፈያ አማ",
    "ማማር ቆዳ የቆዳ ውጤቶች ማምረቻ አማ",
    "ዮልያን የመድኃኒትና የሕክምና መሳሪያዎች አማ",
    "ማያስ የብሎኬት ማምረቻ ኣማ",
    "ሐቅያ የካፌና ሬስቶራንት አገልግሎት አማ",
    "መቅድም የፎቶ ስቱዲዮና ኪነት አቀናጅ አማ",
    "ባዮስ ጠቅላላ የእንጨት ሥራ አማ",
    "ሰሎሜ የሕጻናት እንክብካቤ አማ",
    "ኮብሮስ የባህል ልብሶች ጥልፍና ስፌት አማ",
    "ፊቅስ ባልትና እና ቅመማቅመም ማምረቻና ማከፋፈያ አማ",
    "አናያኖስ የግንባታ ግብኣት አቅራቢ  አማ",
    "ፊሞና የሳሙና ዲተርጅነት ማምረቻ  አማ",
    "ጢሞስ ማር እና የማር ውጤቶች ንግድ አማ",
    "አጋቦስ የትምርት ማዕከል አ.ማ",
    "ቲቶ ኤሌክትሮ ሜካኒካል ሥራዎች አማ",
    "አቴና ሜዲያ አማ",
    "ማልክ ጋርመንት አማ",
    "ኤዴዎስ የቁም እንስሳት እርባታ እና ማድለብ አማ",
    "ኤሊያኖስ የጤና ምርመራ ማዕከል አማ",
    "ያሶን የኦታት አቅርቦት ንግድ አማ",
    "ሐሎስ የህፃናት እንክብካቤ አማ",
    "ኒቆስ የእንስሳት መኖ ማቀነባበሪያ እና ማምረቻ አማ ",
    "ጋይዮስ የፓኬንግ ማተምና ማምረት አማ",
    "አድማጥስ የጽሕፊት መሣሪያ እና የወረቀት ምርት አማ",
    "መርስ ሁለገብ የሕጻናት መዝናኛ ማዕከል አማ",
    "ሐሞና የሽያጭ መመዝገቢያ ወረቀት ማምረቻና ማከፋፈያ አማ",
    "በርስ የጨርቃጨርቅ ምርቶች ንግድ አማ",
  ];

  const finalGraduatedField = useMemo(() => {
    return form.graduatedField === "ሌላ"
      ? customGraduatedField.trim()
      : form.graduatedField.trim();
  }, [form.graduatedField, customGraduatedField]);

  const finalCurrentJob = useMemo(() => {
    return form.currentJob === "ሌላ"
      ? customCurrentJob.trim()
      : form.currentJob.trim();
  }, [form.currentJob, customCurrentJob]);

  const finalSubCity = useMemo(() => {
    return form.subCity === "ሌላ" ? customSubCity.trim() : form.subCity.trim();
  }, [form.subCity, customSubCity]);

  // const alphaRegex = /^[A-Za-z\u1200-\u137F\s]+$/;
  // const phoneRegex = /^\d{10}$/;

  // const onlyDigits = (value) => value.replace(/\D/g, "");

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "phone" || name === "altPhone") {
  //     setForm((prev) => ({
  //       ...prev,
  //       [name]: onlyDigits(value).slice(0, 10),
  //     }));
  //     return;
  //   }

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const normalizeSpaces = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const isAlphabeticText = (value) => {
    const cleaned = normalizeSpaces(value);
    if (!cleaned) return false;

    // Allows Ethiopic, English letters, and spaces only
    return /^[A-Za-z\u1200-\u137F\s]+$/.test(cleaned);
  };

  const isValidPhone = (value) => {
    const cleaned = String(value || "").trim();
    return /^09\d{8}$/.test(cleaned);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const validateAlphaField = (label, value, required = true) => {
  //   const clean = String(value || "").trim();

  //   if (required && !clean) return `${label} ያስገቡ`;
  //   if (!required && !clean) return "";

  //   if (!alphaRegex.test(clean)) {
  //     return `${label} ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም`;
  //   }

  //   return "";
  // };
  // ====
  const validateForm = () => {
    if (!isAlphabeticText(form.firstName)) {
      showModal("ማስጠንቀቂያ", "የራስ ስም ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።", "error");
      return false;
    }

    if (!isAlphabeticText(form.middleName)) {
      showModal("ማስጠንቀቂያ", "የአባት ስም ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።", "error");
      return false;
    }

    if (!isAlphabeticText(form.lastName)) {
      showModal("ማስጠንቀቂያ", "የአያት ስም ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።", "error");
      return false;
    }

    if (!isValidPhone(form.phone)) {
      showModal("ማስጠንቀቂያ", "ዋና ስልክ ቁጥር 09 የሚጀምር 10 ዲጂት መሆን አለበት።", "error");
      return false;
    }

    if (form.altPhone && !isValidPhone(form.altPhone)) {
      showModal("ማስጠንቀቂያ", "ተለዋጭ ስልክ ቁጥር 09 የሚጀምር 10 ዲጂት መሆን አለበት።", "error");
      return false;
    }

    if (!form.organization) {
      showModal("ማስጠንቀቂያ", "እባክዎ ድርጅት ይምረጡ።", "error");
      return false;
    }

    if (!form.sex || !SEX_OPTIONS.includes(form.sex)) {
      showModal("ማስጠንቀቂያ", "እባክዎ ፆታ ይምረጡ።", "error");
      return false;
    }

    if (!finalGraduatedField || !isAlphabeticText(finalGraduatedField)) {
      showModal("ማስጠንቀቂያ", "የትምህርት መስክ ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።", "error");
      return false;
    }

    if (!finalCurrentJob || !isAlphabeticText(finalCurrentJob)) {
      showModal("ማስጠንቀቂያ", "የአሁን ሥራ ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።", "error");
      return false;
    }

    if (!form.subCity) {
      showModal("ማስጠንቀቂያ", "እባክዎ ክ/ከተማ ይምረጡ።", "error");
      return false;
    }

    if (!form.woreda.trim()) {
      showModal("ማስጠንቀቂያ", "ወረዳ መሙላት አለብዎት።", "error");
      return false;
    }

    if (!isAlphabeticText(form.specificPlace)) {
      showModal(
        "ማስጠንቀቂያ",
        "የመኖሪያ አካባቢ ልዩ ስም ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።",
        "error",
      );
      return false;
    }

    if (!isAlphabeticText(form.nearChurch)) {
      showModal(
        "ማስጠንቀቂያ",
        "የአጥቢያ ቤተክርስቲያን ስም ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም።",
        "error",
      );
      return false;
    }

    if (!form.houseType) {
      showModal("ማስጠንቀቂያ", "እባክዎ የቤት ሁኔታ ይምረጡ።", "error");
      return false;
    }

    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (submitting) return;
    if (!validateForm()) return;
    try {
      setSubmitting(true);

      await api.post("/questionnaire", {
        ...form,
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        altPhone: form.altPhone.trim(),
        graduatedField: finalGraduatedField,
        currentJob: finalCurrentJob,
        woreda: form.woreda.trim(),
        kebele: form.kebele.trim(),
        specificPlace: form.specificPlace.trim(),
        nearChurch: form.nearChurch.trim(),
        subCity: finalSubCity,
      });

      showModal("ተሳክቷል", "ቅጹ በተሳካ ሁኔታ ተልኳል።", "success");
      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        altPhone: "",
        organization: "",
        sex: "",
        graduatedField: "",
        currentJob: "",
        subCity: "",
        woreda: "",
        kebele: "",
        specificPlace: "",
        nearChurch: "",
        houseType: "",
      });
      setCustomGraduatedField("");
      setCustomCurrentJob("");

      setTimeout(() => {
        navigate("/thank-you");
      }, 1200);
    } catch (err) {
      showModal(
        "ማስጠንቀቂያ",
        err.response?.data?.message || "የተሳሳተ ነገር ተከስቷል፤ እባክዎን እንደገና ይሞክሩ!",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-8">
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

      {/* <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-xl shadow"> */}
      <form
        onSubmit={submitForm}
        className="bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full"
      >
        <h1 className="text-2xl font-bold mb-6">ይህን ቅጽ ሁሉንም በትክክል ይሙሉ</h1>
        <h3 className="text-sm font-thin mb-5 text-zinc-500">
          ይህ ቅጽ ለማኅበራዊ ጉዳይ አደረጃጀት ልንጠቀመው ስለተፈለገ እባክዎትን ጥቂት ግዜ ወስደው በትክክል ይሙሉ!
        </h3>

        <input
          name="firstName"
          value={form.firstName}
          placeholder="የራስ ስም"
          onChange={handleChange}
          className="border p-3 mb-3 w-full rounded"
        />

        <input
          name="middleName"
          value={form.middleName}
          placeholder="የአባት ስም"
          onChange={handleChange}
          className="border p-3 mb-3 w-full rounded"
        />

        <input
          name="lastName"
          value={form.lastName}
          placeholder="የአያት ስም"
          onChange={handleChange}
          className="border p-3 mb-3 w-full rounded"
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="📲 ስልክ ቁጥር"
          onChange={handleChange}
          className="border p-3 mb-3 w-full rounded"
          inputMode="numeric"
          maxLength={10}
        />

        <input
          name="altPhone"
          value={form.altPhone}
          placeholder="📲 ተለዋጭ ስልክ"
          onChange={handleChange}
          className="border p-3 mb-3 w-full rounded"
          inputMode="numeric"
          maxLength={10}
        />

        <div className="flex flex-col md:flex-row gap-3">
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="border p-3 mb-3 w-full rounded bg-white"
          >
            <option value="">👤 ፆታ ይምረጡ</option>
            {SEX_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="organization"
            className="border p-3 mb-3 w-full rounded bg-white"
            value={form.organization}
            onChange={handleChange}
          >
            <option value="">የቤተሰብ ስም (ድርጅት) ይምረጡ / Select Organization</option>
            {ORGANIZATIONS.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full">
            <select
              name="graduatedField"
              value={form.graduatedField}
              onChange={handleChange}
              className="border p-3 mb-3 w-full rounded bg-white"
            >
              <option value="">🧑🏾‍🎓 የተመረቁበት የትምህርት መስክ</option>
              {GRADUATED_FIELDS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {form.graduatedField === "ሌላ" && (
              <input
                value={customGraduatedField}
                onChange={(e) => setCustomGraduatedField(e.target.value)}
                placeholder="ሌላ የትምህርት መስክ ይጻፉ "
                className="border p-3 mb-3 w-full rounded"
              />
            )}
          </div>

          <div className="w-full">
            <select
              name="currentJob"
              value={form.currentJob}
              onChange={handleChange}
              className="border p-3 mb-3 w-full rounded bg-white"
            >
              <option value="">💼 አሁን እየሰሠሩት ያልለ ሥራ </option>
              {CURRENT_JOBS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {form.currentJob === "ሌላ" && (
              <input
                value={customCurrentJob}
                onChange={(e) => setCustomCurrentJob(e.target.value)}
                placeholder="ሌላ ሥራ ይጻፉ "
                className="border p-3 mb-3 w-full rounded"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full">
            <select
              name="subCity"
              className="border p-3 mb-3 w-full rounded bg-white"
              value={form.subCity}
              onChange={handleChange}
            >
              <option value="">ክ/ከተማ ስም ይምረጡ / Sub-City</option>
              {SUBCITIES.map((scity) => (
                <option key={scity} value={scity}>
                  {scity}
                </option>
              ))}
            </select>
            {form.subCity === "ሌላ" && (
              <input
                value={customSubCity}
                onChange={(e) => setCustomeSubCity(e.target.value)}
                placeholder="ሌላ ክ/ለ ከተማ ይጻፉ "
                className="border p-3 mb-3 w-full rounded"
              />
            )}
          </div>
          <input
            name="woreda"
            value={form.woreda}
            placeholder="ወረዳ"
            onChange={handleChange}
            className="border p-3 mb-3 w-full rounded"
          />

          <input
            name="kebele"
            value={form.kebele}
            placeholder="ቀበሌ"
            onChange={handleChange}
            className="border p-3 mb-3 w-full rounded"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            name="specificPlace"
            value={form.specificPlace}
            placeholder="🏡 የመኖሪያ አካባቢ ልዩ የቦታ ስም"
            onChange={handleChange}
            className="border p-3 mb-3 w-full rounded"
          />

          <input
            name="nearChurch"
            value={form.nearChurch}
            placeholder="⛪️ አጥቢያ ቤተክርስቲያን"
            onChange={handleChange}
            className="border p-3 mb-3 w-full rounded"
          />
        </div>

        <select
          name="houseType"
          value={form.houseType}
          onChange={handleChange}
          className="border p-3 mb-3 w-full rounded bg-white"
        >
          <option value="">🏠 የቤት ሁኔታ</option>
          {HOUSE_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-500 text-white w-full py-3 rounded-lg hover:bg-purple-600 hover:scale-[1.01] transition disabled:opacity-60"
        >
          {submitting ? "በመላክ ላይ...ይጠብቁ" : "ያስገቡ / Submit"}
        </button>

        <div className="text-center text-sm font-thin mb-5 text-zinc-500">
          <h5>
            ያስገቡ የሚለውን ከመንካትዎ በፊት ትክክለኛ መረጃ መሙላትዎን ያረጋግጡ፤ ከዚያ የማረጋገጫ መልዕክቱ እስኪታይ
            እባክዎ ጥቂት ይታገሱ።{" "}
          </h5>{" "}
        </div>
      </form>
      {/* </div> */}
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
