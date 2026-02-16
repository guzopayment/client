import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

export default function AdminReport() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/reports/confirmed");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.results || res.data?.reports || [];

        setReport(data);
      } catch (err) {
        console.error("Report fetch error:", err);
        setReport([]);
      }
    };

    fetchReport();
  }, []);

  const exportPDF = () => {
    window.open(`${api.defaults.baseURL}/reports/export/pdf`);
  };

  const exportExcel = () => {
    window.open(`${api.defaults.baseURL}/reports/export/excel`);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Report</h1>

      <div className="mb-6 space-x-4">
        <button
          onClick={exportPDF}
          className="px-5 py-2 rounded-lg shadow bg-purple-600 text-white transition hover:bg-purple-700 hover:scale-105 hover:shadow-lg"
        >
          Download PDF
        </button>

        <button
          onClick={exportExcel}
          className="px-5 py-2 rounded-lg shadow bg-purple-600 text-white transition hover:bg-purple-700 hover:scale-105 hover:shadow-lg"
        >
          Download Excel
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-purple-400 text-white">
              <th className="p-3">Name</th>
              <th className="p-3">Organization</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Participants</th>
            </tr>
          </thead>

          <tbody>
            {report.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No confirmed data
                </td>
              </tr>
            ) : (
              report.map((r, i) => (
                <tr
                  key={r._id || i}
                  className="border-b text-center transition hover:bg-purple-50 hover:shadow-md hover:-translate-y-[1px]"
                >
                  <td>{r.fullName}</td>
                  <td>{r.organization}</td>
                  <td>{r.phone}</td>
                  <td>{r.participants}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
