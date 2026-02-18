import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(bookings.length / perPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * perPage;
    return bookings.slice(start, start + perPage);
  }, [bookings, page]);

  /* AUTH CHECK */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/");
    // (api interceptor will attach it, but keeping this doesn't hurt)
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [navigate]);

  /* REFRESH ONLY STATS */
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

  /* INITIAL LOAD */
  const loadData = async () => {
    try {
      await refreshStats();

      const bookRes = await api.get("/bookings");

      // ✅ Handle ALL possible response shapes
      const raw =
        bookRes.data?.bookings ||
        bookRes.data?.data ||
        (Array.isArray(bookRes.data) ? bookRes.data : []);

      const sortedBookings = (raw || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setBookings(sortedBookings);

      const historyRes = await api.get("/history");
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error("Load error:", err.response?.data || err.message);
      setBookings([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* REALTIME SOCKET */
  useEffect(() => {
    socket.off("newBooking");
    socket.off("history");

    socket.on("newBooking", async (newBooking) => {
      setBookings((prev) => [newBooking, ...prev]);
      setPage(1);
      await refreshStats();
    });

    socket.on("history", (d) => setHistory((prev) => [d, ...prev]));

    return () => {
      socket.off("newBooking");
      socket.off("history");
    };
  }, []);

  /* PAYMENT ACTIONS — OPTIMISTIC UPDATE */
  const confirmPayment = async (id) => {
    try {
      await api.put(`/admin/confirm/${id}`);

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Confirmed" } : b)),
      );

      await refreshStats();
    } catch (err) {
      console.error(err);
      alert("Failed to confirm payment");
    }
  };

  const rejectPayment = async (id) => {
    try {
      await api.put(`/admin/reject/${id}`);

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Rejected" } : b)),
      );

      await refreshStats();
    } catch (err) {
      console.error(err);
      alert("Failed to reject payment");
    }
  };

  /* ORG STATS */
  const orgStats = useMemo(() => {
    return bookings.reduce((acc, b) => {
      const org = b.organization || "N/A";
      acc[org] = (acc[org] || 0) + (b.participants || 0);
      return acc;
    }, {});
  }, [bookings]);

  /* SIDEBAR MENU */
  const menu = [
    { id: "dashboard", label: "Dashboard Overview" },
    { id: "report", label: "Report" },
    { id: "history", label: "History Log " },
    { id: "logout", label: "LOGOUT  " },
  ];

  const handleMenu = (id) => {
    setSidebarOpen(false);

    if (id === "logout") {
      localStorage.removeItem("adminToken");
      navigate("/");
    } else setActive(id);
  };

  if (!stats)
    return (
      <p className="text-center mt-40 text-xl text-purple-900 font-extrabold animate-pulse">
        Loading...
      </p>
    );

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

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-purple-600 mb-8">
          {active === "dashboard" && "Dashboard Overview"}
          {active === "report" && "Report Overview"}
          {active === "history" && "History Log"}
        </h1>

        {active === "dashboard" && (
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

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead className="bg-purple-400 text-white">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Organization</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Participants</th>
                    <th className="p-2">Proof</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-6 text-gray-500 text-center">
                        No participant bookings yet
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="text-center border-b hover:bg-purple-50 transition"
                      >
                        <td>{booking.name || "N/A"}</td>
                        <td>{booking.organization || "N/A"}</td>
                        <td>{booking.phone || "N/A"}</td>
                        <td>{booking.participants || 0}</td>

                        <td>
                          {booking.paymentProof ? (
                            <a
                              href={
                                booking.paymentProof?.startsWith("http")
                                  ? booking.paymentProof
                                  : `https://server-y72m.onrender.com/uploads/${encodeURIComponent(
                                      booking.paymentProof || "",
                                    )}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              View Proof
                            </a>
                          ) : (
                            "No proof"
                          )}
                        </td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded text-white ${
                              booking.status === "Confirmed"
                                ? "bg-green-500"
                                : booking.status === "Rejected"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </td>

                        <td className="space-x-2">
                          <button
                            onClick={() => confirmPayment(booking._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:scale-105 transition"
                          >
                            Confirm
                          </button>

                          <button
                            onClick={() => rejectPayment(booking._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:scale-105 transition"
                          >
                            Reject
                          </button>
                        </td>
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

            {/* ORG STATS */}
            <div className="mb-6 mt-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Organization Participation
              </h2>

              {Object.entries(orgStats).map(([org, count]) => (
                <div
                  key={org}
                  className="bg-white p-3 rounded mb-2 shadow hover:shadow-xl hover:-translate-y-1 transition"
                >
                  {org} : {count} participants
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ num, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600">{num}</h2>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}
