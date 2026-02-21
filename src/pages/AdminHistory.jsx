// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import socket from "../socket";

// export default function AdminHistory() {
//   const navigate = useNavigate();

//   const [history, setHistory] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [page, setPage] = useState(1);
//   const perPage = 12;
//   const totalPages = Math.ceil(history.length / perPage) || 1;

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [totalPages, page]);

//   const paginated = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return history.slice(start, start + perPage);
//   }, [history, page]);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) navigate("/");
//     api.defaults.headers.common.Authorization = `Bearer ${token}`;
//   }, [navigate]);

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/history");

//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.data || res.data?.history || res.data?.results || [];

//       const sorted = (data || []).sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
//       );

//       setHistory(sorted);
//     } catch (err) {
//       console.error("History fetch error:", err.response?.data || err.message);
//       setHistory([]);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   // realtime updates
//   useEffect(() => {
//     socket.off("history");
//     socket.on("history", (d) => {
//       setHistory((prev) => [d, ...prev]);
//       setPage(1);
//     });

//     return () => {
//       socket.off("history");
//     };
//   }, []);

//   const menu = [
//     { id: "dashboard", label: "Dashboard Overview", path: "/admin-dashboard" },
//     { id: "report", label: "Report", path: "/admin-report" },
//     { id: "history", label: "History Log", path: "/admin-history" },
//     { id: "logout", label: "LOGOUT", action: "logout" },
//   ];

//   const handleMenu = (item) => {
//     setSidebarOpen(false);
//     if (item.action === "logout") {
//       localStorage.removeItem("adminToken");
//       navigate("/");
//       return;
//     }
//     if (item.path) navigate(item.path);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-200">
//       {/* MOBILE MENU */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         ☰
//       </button>

//       {/* SIDEBAR */}
//       <aside
//         className={`fixed md:static z-40 h-full md:h-auto w-64 bg-purple-400 text-white p-6 shadow-xl
//         transform transition-transform duration-300
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

//         <ul className="space-y-4">
//           {menu.map((item) => (
//             <li
//               key={item.id}
//               onClick={() => handleMenu(item)}
//               className={`cursor-pointer p-3 rounded-xl transition-all duration-300
//               ${
//                 item.id === "history"
//                   ? "bg-white text-purple-600 font-bold shadow"
//                   : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
//               }`}
//             >
//               {item.label}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 p-4 md:p-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
//           <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
//             History Log
//           </h1>

//           <button
//             onClick={fetchHistory}
//             className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
//           >
//             Refresh
//           </button>
//         </div>

//         {history.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-600">
//             No history yet
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {paginated.map((h, i) => (
//               <div
//                 key={h._id || i}
//                 className="bg-white p-4 rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//                   <h2 className="text-lg font-bold text-purple-700">
//                     {h.title || "Activity"}
//                   </h2>
//                   <span className="text-sm text-gray-500">
//                     {h.createdAt ? new Date(h.createdAt).toLocaleString() : ""}
//                   </span>
//                 </div>
//                 <p className="text-gray-700 mt-2">{h.message || "—"}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* PAGINATION */}
//         {history.length > 0 && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
//             >
//               Prev
//             </button>

//             <span className="font-semibold text-purple-700">
//               Page {page} / {totalPages}
//             </span>

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket";

export default function AdminHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // notification
  const [notifCount, setNotifCount] = useState(0);

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

  // ✅ LOCK BODY SCROLL WHEN SIDEBAR OPEN
  // useEffect(() => {
  //   if (!sidebarOpen) return;

  //   const prev = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     document.body.style.overflow = prev;
  //   };
  // }, [sidebarOpen]);
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

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

  useEffect(() => {
    socket.off("newBooking");
    socket.on("newBooking", () => setNotifCount((c) => c + 1));
    return () => socket.off("newBooking");
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
      {/* ✅ MOBILE MENU BUTTON (top-right + X animation) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-purple-600 text-white w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <span
            className={`absolute left-0 top-1 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "rotate-45 top-3" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-3 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-5 w-6 h-[2px] bg-white transition-all duration-300 ${
              sidebarOpen ? "-rotate-45 top-3" : ""
            }`}
          />
        </div>
      </button>

      {/* ✅ OVERLAY (mobile only) */}
      {/* {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
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

      {/* ✅ MAIN (pt-20 so hamburger NEVER covers title) */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
            History Log
          </h1>

          {/* <button
            onClick={fetchHistory}
            className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
          >
            Refresh
          </button> */}
          <div className="flex items-start justify-between gap-3 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
              {/* <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
                History Log
              </h1> */}

              <div className="flex gap-3">
                {/* <button
                  onClick={() => setNotifCount(0)}
                  className="relative bg-white text-purple-700 px-4 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
                  title="New bookings"
                >
                  🔔
                  {notifCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow">
                      {notifCount}
                    </span>
                  )}
                </button> */}
                <button
                  onClick={openNotifications}
                  className="relative bg-white text-purple-700 px-4 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
                  title="New bookings"
                >
                  🔔
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow">
                    {notifCount}
                  </span>
                </button>

                <button
                  onClick={fetchHistory}
                  className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
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
