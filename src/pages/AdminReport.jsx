import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";

export default function AdminReport() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [report, setReport] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(report.length / perPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return report.slice(start, start + perPage);
  }, [report, page]);

  // auth
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/");
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [navigate]);

  const refreshStats = async () => {
    try {
      const statRes = await api.get("/admin/stats");
      setStats(statRes.data || {});
    } catch (err) {
      console.error("Stats error:", err.response?.data || err.message);
      setStats({
        totalParticipants: 0,
        pendingPayments: 0,
        organizationBreakdown: {},
        totalBookings: 0,
      });
    }
  };

  const fetchReport = async () => {
    try {
      await refreshStats();

      const res = await api.get("/reports/confirmed");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.results || res.data?.reports || [];

      // sort newest first
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setReport(sorted);
    } catch (err) {
      console.error("Report fetch error:", err.response?.data || err.message);
      setReport([]);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // realtime update if admin confirms payments (optional but consistent)
  useEffect(() => {
    socket.off("newBooking");
    socket.on("newBooking", () => fetchReport());

    return () => {
      socket.off("newBooking");
    };
  }, []);

  // const exportPDF = () => {
  //   window.open(`${api.defaults.baseURL}/reports/export/pdf`, "_blank");
  // };

  // const exportExcel = () => {
  //   window.open(`${api.defaults.baseURL}/reports/export/excel`, "_blank");
  // };
  const downloadFile = async (url, filename) => {
    try {
      const res = await api.get(url, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err.response?.data || err.message);
      alert("Download failed");
    }
  };

  const exportPDF = () =>
    downloadFile("/reports/export/pdf", "confirmed-report.pdf", "_blank");
  const exportExcel = () =>
    downloadFile("/reports/export/excel", "confirmed-report.xlsx", "_blank");

  const menu = [
    { id: "dashboard", label: "Dashboard Overview", path: "/admin-dashboard" },
    { id: "report", label: "Report", path: "/admin-report" },
    { id: "history", label: "History Log", path: "/admin-history" },
    { id: "logout", label: "LOGOUT", action: "logout" },
  ];

  const handleMenu = (item) => {
    setSidebarOpen(false);
    if (item.action === "logout") {
      localStorage.removeItem("adminToken");
      navigate("/");
      return;
    }
    if (item.path) navigate(item.path);
  };

  if (!stats)
    return (
      <p className="text-center mt-40 text-xl text-purple-900 font-extrabold animate-pulse">
        Loading...
      </p>
    );

  useEffect(() => {
    if (!sidebarOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* MOBILE MENU */}
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300"
      >
        <div className="relative w-6 h-6">
          {/* top line */}
          <span
            className={`absolute left-0 top-1 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "rotate-45 top-3" : ""
            }`}
          />
          {/* middle line */}
          <span
            className={`absolute left-0 top-3 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "opacity-0" : ""
            }`}
          />
          {/* bottom line */}
          <span
            className={`absolute left-0 top-5 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "-rotate-45 top-3" : ""
            }`}
          />
        </div>
      </button>
      {/* OVERLAY (mobile only) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 h-full md:h-auto w-64 bg-purple-400 text-white p-6 shadow-xl
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

        <ul className="space-y-4">
          {menu.map((item) => (
            <li
              key={item.id}
              onClick={() => handleMenu(item)}
              className={`cursor-pointer p-3 rounded-xl transition-all duration-300
              ${
                item.id === "report"
                  ? "bg-white text-purple-600 font-bold shadow"
                  : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-purple-600 mb-8">
          Report Overview
        </h1>

        {/* TOP ACTIONS */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <div className="flex gap-3">
            <button
              onClick={exportPDF}
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition hover:scale-105 disabled:opacity-40"
            >
              Download PDF
            </button>
            <button
              onClick={exportExcel}
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition hover:scale-105 disabled:opacity-40"
            >
              Download Excel
            </button>
          </div>

          <button
            onClick={fetchReport}
            className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
          >
            Refresh
          </button>
        </div>

        {/* STATS CARDS (same style as dashboard) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10">
          <StatCard
            num={stats.totalParticipants || 0}
            label="Total Participants"
          />
          <StatCard
            num={Object.keys(stats.organizationBreakdown || {}).length}
            label="Total Organizations"
          />
          {/* <StatCard num={report.length} label="Confirmed Records" /> */}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-purple-400 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Organization</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Participants</th>
              </tr>
            </thead>

            <tbody>
              {report.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-gray-500 text-center">
                    No confirmed data
                  </td>
                </tr>
              ) : (
                paginated.map((r, i) => (
                  <tr
                    key={r._id || i}
                    className="text-center border-b hover:bg-purple-50 transition"
                  >
                    <td>{r.name || "—"}</td>
                    <td>{r.organization || "—"}</td>
                    <td>{r.phone || "—"}</td>
                    <td>{r.participants ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
            >
              Prev
            </button>

            <span className="font-semibold text-purple-700">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ num, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition">
      <h2 className="text-xl sm:text-4xl font-bold text-purple-600 leading-tight">
        {num}
      </h2>
      <p className="text-[11px] sm:text-base text-gray-600 mt-1 sm:mt-2 leading-tight">
        {label}
      </p>
    </div>
  );
}
