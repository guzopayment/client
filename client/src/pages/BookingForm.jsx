import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function BookingForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    phone: "",
    participants: "",
  });

  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    // ===== VALIDATION =====
    if (!form.fullName.trim()) {
      alert("Full name is required");
      return;
    }

    if (!form.organization.trim()) {
      alert("Organization is required");
      return;
    }

    if (!form.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    if (!form.participants || Number(form.participants) <= 0) {
      alert("Participants must be greater than 0");
      return;
    }

    if (!file) {
      alert("Payment proof is required");
      return;
    }

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key].toString().trim());
      });

      data.append("paymentProof", file);

      await api.post("/bookings", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Booking submitted!");
      navigate("/thank-you");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error submitting");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Ticket Booking</h2>

        <input
          placeholder="Full Name"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          placeholder="Organization"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="number"
          placeholder="Participants"
          className="border p-3 mb-3 w-full rounded"
          onChange={(e) => setForm({ ...form, participants: e.target.value })}
        />

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="bg-purple-500 text-white w-full py-3 rounded-lg">
          Submit Payment Proof
        </button>

        <div className="text-sm text-gray-500 mt-2">
          * Please upload a payment proof to complete your booking.
        </div>
      </form>
    </div>
  );
}
