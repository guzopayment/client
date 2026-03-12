import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import back from "../assets/home.png";

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
  const [submitting, setSubmitting] = useState(false);

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
    "ራሴን የምሰራ",
    "ስራ ፈላጊ",
    "የቤት እመቤት",
    "ሌላ",
  ];

  const SEX_OPTIONS = ["ወንድ", "ሴት"];
  const HOUSE_TYPES = ["የራሴ", "ኪራይ", "ከቤተሰብ ጋር", "አዲስ"];

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
    "ቆሮስ የእንጀራ ምርት አማ",
    "ቦሎስ የሕንጻ ሥራ ተቋራጭ አማ",
    "ማማር ቆዳ የቆዳ ውጤቶች ማምረቻ አማ",
    "ዮልያን የመድኃኒትና የሕክምና መሳሪያዎች አማ",
    "ማያስ የብሎኬት ማምረቻ ኣማ",
    "ሐቅያ የካፌና ሬስቶራንት አገልግሎት አማ",
    "መቅድም የፎቶ ስቱዲዮና ኪነት አቀናጅ አማ",
    "ባዮስ ጠቅላላ የእንጨት ሥራ አማ",
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

  const alphaRegex = /^[A-Za-z\u1200-\u137F\s]+$/;
  const phoneRegex = /^\d{10}$/;

  const onlyDigits = (value) => value.replace(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "altPhone") {
      setForm((prev) => ({
        ...prev,
        [name]: onlyDigits(value).slice(0, 10),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAlphaField = (label, value, required = true) => {
    const clean = String(value || "").trim();

    if (required && !clean) return `${label} ያስገቡ`;
    if (!required && !clean) return "";

    if (!alphaRegex.test(clean)) {
      return `${label} ቁጥር ወይም ልዩ ምልክት መያዝ የለበትም`;
    }

    return "";
  };

  const validateForm = () => {
    let msg = "";

    msg = validateAlphaField("የራስ ስም", form.firstName);
    if (msg) return msg;

    msg = validateAlphaField("የአባት ስም", form.middleName);
    if (msg) return msg;

    msg = validateAlphaField("የአያት ስም", form.lastName);
    if (msg) return msg;

    if (!phoneRegex.test(form.phone)) {
      return "ዋና ስልክ ቁጥር 10 ዲጂት ቁጥር ብቻ መሆን አለበት";
    }

    if (form.altPhone && !phoneRegex.test(form.altPhone)) {
      return "ተለዋጭ ስልክ ቁጥር 10 ዲጂት ቁጥር ብቻ መሆን አለበት";
    }

    if (!form.sex) return "ፆታ ይምረጡ";
    if (!form.organization) return "ድርጅት ይምረጡ";

    msg = validateAlphaField("የትምህርት መስክ", finalGraduatedField);
    if (msg) return msg;

    msg = validateAlphaField("የአሁን ሥራ", finalCurrentJob);
    if (msg) return msg;

    if (!form.subCity) return "ክ/ከተማ ይምረጡ";
    if (!String(form.woreda || "").trim()) return "ወረዳ ያስገቡ";

    msg = validateAlphaField("የመኖሪያ አካባቢ ልዩ የቦታ ስም", form.specificPlace);
    if (msg) return msg;

    msg = validateAlphaField("አጥቢያ ቤተክርስቲያን", form.nearChurch);
    if (msg) return msg;

    if (!form.houseType) return "የቤት ሁኔታ ይምረጡ";

    return "";
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const payload = {
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
      subCity: form.subCity,
    };

    try {
      setSubmitting(true);
      await api.post("/questionnaire", payload);
      navigate("/thank-you");
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
    } catch (err) {
      alert(
        err.response?.data?.message || "የተሳሳተ ነገር ተከስቷል፤ እባክዎን እንደገና ይሞክሩ!",
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

      <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-xl shadow">
        <form
          onSubmit={submitForm}
          className="bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full"
        >
          <h1 className="text-2xl font-bold mb-6">ይህን ቅጽ ሁሉንም በትክክል ይሙሉ</h1>
          <h3 className="text-sm font-thin mb-5 text-zinc-500">
            ይህ ቅጽ ለማኅበራዊ ጉዳይ አደረጃጀት ልንጠቀመው ስለተፈለገ እባክዎትን ትቂት ግዜ ወስደው በትክክል ይሙሉ!
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
                  placeholder="ሌላ የትምህርት መስክ"
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
                <option value="">💼 የአሁን ሥራዎት</option>
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
                  placeholder="ሌላ ሥራ"
                  className="border p-3 mb-3 w-full rounded"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
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
            className="bg-purple-500 text-white w-full py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? "በማስገባት ላይ..." : "ያስገቡ / Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
