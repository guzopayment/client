import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";

export default function AdminHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = Math.ceil(history.length / perPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return history.slice(start, start + perPage);
  }, [history, page]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/");
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.history || res.data?.results || [];

      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setHistory(sorted);
    } catch (err) {
      console.error("History fetch error:", err.response?.data || err.message);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // realtime updates
  useEffect(() => {
    socket.off("history");
    socket.on("history", (d) => {
      setHistory((prev) => [d, ...prev]);
      setPage(1);
    });

    return () => {
      socket.off("history");
    };
  }, []);

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

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* MOBILE MENU */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

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
                item.id === "history"
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
            History Log
          </h1>

          <button
            onClick={fetchHistory}
            className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
          >
            Refresh
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-600">
            No history yet
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((h, i) => (
              <div
                key={h._id || i}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h2 className="text-lg font-bold text-purple-700">
                    {h.title || "Activity"}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {h.createdAt ? new Date(h.createdAt).toLocaleString() : ""}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{h.message || "—"}</p>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {history.length > 0 && (
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
        )}
      </main>
    </div>
  );
}
