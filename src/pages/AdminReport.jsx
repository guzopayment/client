import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

export default function AdminReport() {
  const [report, setReport] = useState([]);
  const navigate = useNavigate();
  const [active, setActive] = useState("report");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // ✅ ensure admin token is attached (same idea as AdminDashboard)
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      api.defaults.headers.common.Authorization = `Bearer ${adminToken}`;
    }

    const fetchReport = async () => {
      try {
        const res = await api.get("/reports/confirmed");

        const raw = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.results || res.data?.reports || [];

        // ✅ normalize fields so UI can render correctly
        const normalized = (raw || []).map((r) => ({
          ...r,
          // your model uses "name" not "fullName"
          name: r?.name ?? r?.fullName ?? "",
          organization: r?.organization ?? "",
          phone: r?.phone ?? "",
          participants: r?.participants ?? 0,
        }));

        setReport(normalized);
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
  const handleMenu = (id) => {
    setSidebarOpen(false);

    if (id === "logout") {
      localStorage.removeItem("adminToken");
      navigate("/");
      return;
    }

    if (id === "report") {
      navigate("/admin-report"); // ✅ go to report page
      return;
    }

    setActive(id); // dashboard/history stay inside this page
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <AdminLayout>
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
                onClick={() => handleMenu(item.id)}
                className={`cursor-pointer p-3 rounded-xl transition-all duration-300
              ${
                active === item.id
                  ? "bg-white text-purple-600 font-bold shadow"
                  : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
              }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600 mb-8">
            {active === "dashboard" && "Dashboard Overview"}
            {active === "report" && "Report Overview"}
            {active === "history" && "History Log"}
          </h1>

          {active === "report" && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                  num={stats.totalParticipants || 0}
                  label="Total Participants"
                />
                <StatCard
                  num={Object.keys(stats.organizationBreakdown || {}).length}
                  label="Total Organizations"
                />
                <StatCard
                  num={stats.pendingPayments || 0}
                  label="Pending Payments Confirmation"
                />
              </div>

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
                          <td>{r.name || "N/A"}</td>
                          <td>{r.organization || "N/A"}</td>
                          <td>{r.phone || "N/A"}</td>
                          <td>{r.participants ?? 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </AdminLayout>
    </div>
  );
}
