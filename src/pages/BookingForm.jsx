import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import back from "../assets/home.png";

export default function BookingForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    organization: "",
    phone: "",
    participants: "",
  });

  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("ሙሉ ስም ያስገቡ ");
      return;
    }
    if (!form.organization.trim()) {
      alert("የቤተሰብ ስም (ከየት ድርጅት መሆንዎን) ይግለጹ");
      return;
    }
    if (!form.phone.trim()) {
      alert("ስልክ ቁጥር ያስገቡ ");
      return;
    }
    if (!form.participants || Number(form.participants) <= 0) {
      alert("ተሳታፊ ቤተሰብ ብዛት ይግለጹ > 0");
      return;
    }
    if (!file) {
      alert(" የክፍያ ደረሰኙን ያስገቡ ");
      return;
    }

    try {
      const data = new FormData();

      data.append("name", form.name.trim());
      data.append("organization", form.organization.trim());
      data.append("phone", form.phone.trim());
      data.append("participants", String(form.participants).trim());

      // ✅ this attaches the file to the request
      data.append("paymentProof", file);

      await api.post("/bookings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("መረጃዎን በትክክል አስገብተዋል፤ እባክዎ የአስተዳደሩን ማረጋገጫ ይጠብቁ!");
      navigate("/thank-you");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("የተሳሳተ ነገር ተከስቷል። እባክዎ ደግመው ይሞክሩ።");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="text-center">
        <button
          className=" absolute left-4 top-4 bg-white text-purple-600
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

      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          የክፍያ ደረሰኝዎትን ከማስገባትዎት በፊት ይህን ቅጽ ሁሉንም በትክክል ይሙሉ{" "}
        </h2>

        <input
          placeholder="ሙሉ ስምዎትን ይጻፉ / Full Name "
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="የቤተሰብ ስም(ከየት ድርጅት፡ ቆሮስ? )  / Organization"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
        />

        <input
          type="tel:"
          placeholder="ስልክ ቁጥርዎትን ይጻፉ/ Phone Number"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="number"
          placeholder="ምን ያህል ሰዎች ከእርስዎ ጋር ይሳተፋሉ? / Participants"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, participants: e.target.value })}
        />

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button className="bg-purple-500 text-white w-full py-3 rounded-lg">
          ያስገቡ / Submit
        </button>

        <div className="text-sm text-gray-500 mt-2">
          * ትክክለኛ ደረሰኝ ስለማስገባትዎትን እባክዎ በትክክል ያረጋግጡ። ትክክለኛ ደረሰኝ ካልሆነ በአስትዳድሩ ውድቅ
          ይደረግብዎታል። / Please ensure you upload a valid payment proof. Invalid
          proof may lead to booking cancellation.
        </div>
      </form>
    </div>
  );
}
