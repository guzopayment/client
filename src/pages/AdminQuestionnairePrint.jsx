import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminQuestionnairePrint() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/");
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/questionnaire");
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "Print page load error:",
          err.response?.data || err.message,
        );
      }
    };

    load();
  }, []);

  const grouped = useMemo(() => {
    return rows.reduce((acc, item) => {
      const key = `${item.subCity}__${item.woreda}__${item.nearChurch}`;
      if (!acc[key]) {
        acc[key] = {
          subCity: item.subCity,
          woreda: item.woreda,
          nearChurch: item.nearChurch,
          rows: [],
        };
      }
      acc[key].rows.push(item);
      return acc;
    }, {});
  }, [rows]);

  const groupedList = useMemo(() => Object.values(grouped), [grouped]);

  const printPage = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white p-6 print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-purple-700">
          Print-Friendly Questionnaire Summary
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin-questionnaire")}
            className="bg-gray-200 px-5 py-2 rounded-full"
          >
            Back
          </button>

          <button
            onClick={printPage}
            className="bg-purple-600 text-white px-5 py-2 rounded-full"
          >
            Print
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {groupedList.map((group, idx) => (
          <div
            key={`${group.subCity}-${group.woreda}-${group.nearChurch}-${idx}`}
            className="border border-gray-300 rounded-xl p-4 break-inside-avoid"
          >
            <h2 className="text-xl font-bold text-purple-700">
              {group.subCity}
            </h2>
            <p className="text-gray-700">
              Woreda: {group.woreda} | Near Church: {group.nearChurch}
            </p>
            <p className="text-gray-500 mb-4">
              Total Records: {group.rows.length}
            </p>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Questionnaire ID</th>
                  <th className="border p-2">Full Name</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Organization</th>
                  <th className="border p-2">Current Job</th>
                  <th className="border p-2">Graduated Field</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((r) => (
                  <tr key={r._id}>
                    <td className="border p-2">{r.questionnaireId || "—"}</td>
                    <td className="border p-2">
                      {r.firstName} {r.middleName} {r.lastName}
                    </td>
                    <td className="border p-2">{r.phone}</td>
                    <td className="border p-2">{r.organization}</td>
                    <td className="border p-2">{r.currentJob}</td>
                    <td className="border p-2">{r.graduatedField}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {groupedList.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
