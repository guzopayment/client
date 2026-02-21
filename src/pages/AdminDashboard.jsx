// // import { useEffect, useState, useMemo } from "react";
// // import { useNavigate } from "react-router-dom";
// // import socket from "../socket";
// // import api from "../services/api";

// // export default function AdminDashboard() {
// //   const navigate = useNavigate();

// //   const [active, setActive] = useState("dashboard");
// //   const [stats, setStats] = useState(null);
// //   const [bookings, setBookings] = useState([]);
// //   const [history, setHistory] = useState([]);
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   /* PAGINATION */
// //   const [page, setPage] = useState(1);
// //   const perPage = 8;
// //   const totalPages = Math.ceil(bookings.length / perPage) || 1;

// //   useEffect(() => {
// //     if (page > totalPages) setPage(totalPages);
// //   }, [totalPages, page]);

// //   const paginatedBookings = useMemo(() => {
// //     const start = (page - 1) * perPage;
// //     return bookings.slice(start, start + perPage);
// //   }, [bookings, page]);

// //   /* ✅ LOCK BODY SCROLL WHEN SIDEBAR OPEN (MUST BE TOP-LEVEL HOOK) */
// //   useEffect(() => {
// //     if (!sidebarOpen) return;

// //     const prev = document.body.style.overflow;
// //     document.body.style.overflow = "hidden";

// //     return () => {
// //       document.body.style.overflow = prev;
// //     };
// //   }, [sidebarOpen]);

// //   /* AUTH CHECK */
// //   useEffect(() => {
// //     const token = localStorage.getItem("adminToken");
// //     if (!token) navigate("/");
// //     api.defaults.headers.common.Authorization = `Bearer ${token}`;
// //   }, [navigate]);

// //   /* REFRESH ONLY STATS */
// //   const refreshStats = async () => {
// //     try {
// //       const statRes = await api.get("/admin/stats");
// //       setStats(statRes.data || {});
// //     } catch (err) {
// //       console.error("Stats error:", err.response?.data || err.message);
// //       setStats({
// //         totalParticipants: 0,
// //         pendingPayments: 0,
// //         organizationBreakdown: {},
// //         totalBookings: 0,
// //       });
// //     }
// //   };

// //   /* INITIAL LOAD */
// //   const loadData = async () => {
// //     try {
// //       await refreshStats();

// //       const bookRes = await api.get("/bookings");
// //       const raw =
// //         bookRes.data?.bookings ||
// //         bookRes.data?.data ||
// //         (Array.isArray(bookRes.data) ? bookRes.data : []);

// //       const sortedBookings = (raw || []).sort(
// //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
// //       );

// //       setBookings(sortedBookings);

// //       const historyRes = await api.get("/history");
// //       setHistory(historyRes.data || []);
// //     } catch (err) {
// //       console.error("Load error:", err.response?.data || err.message);
// //       setBookings([]);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   /* REALTIME SOCKET */
// //   useEffect(() => {
// //     socket.off("newBooking");
// //     socket.off("history");

// //     socket.on("newBooking", async (newBooking) => {
// //       setBookings((prev) => [newBooking, ...prev]);
// //       setPage(1);
// //       await refreshStats();
// //     });

// //     socket.on("history", (d) => setHistory((prev) => [d, ...prev]));

// //     return () => {
// //       socket.off("newBooking");
// //       socket.off("history");
// //     };
// //   }, []);

// //   /* PAYMENT ACTIONS */
// //   const confirmPayment = async (id) => {
// //     try {
// //       await api.put(`/admin/confirm/${id}`);
// //       setBookings((prev) =>
// //         prev.map((b) => (b._id === id ? { ...b, status: "Confirmed" } : b)),
// //       );
// //       await refreshStats();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to confirm payment");
// //     }
// //   };

// //   const rejectPayment = async (id) => {
// //     try {
// //       await api.put(`/admin/reject/${id}`);
// //       setBookings((prev) =>
// //         prev.map((b) => (b._id === id ? { ...b, status: "Rejected" } : b)),
// //       );
// //       await refreshStats();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to reject payment");
// //     }
// //   };

// //   /* ORG STATS */
// //   const orgStats = useMemo(() => {
// //     return bookings.reduce((acc, b) => {
// //       const org = b.organization || "N/A";
// //       acc[org] = (acc[org] || 0) + (b.participants || 0);
// //       return acc;
// //     }, {});
// //   }, [bookings]);

// //   /* SIDEBAR MENU */
// //   const menu = [
// //     { id: "dashboard", label: "Dashboard Overview" },
// //     { id: "report", label: "Report" },
// //     { id: "history", label: "History Log " },
// //     { id: "logout", label: "LOGOUT  " },
// //   ];

// //   const handleMenu = (id) => {
// //     setSidebarOpen(false);

// //     if (id === "logout") {
// //       localStorage.removeItem("adminToken");
// //       navigate("/");
// //       return;
// //     }

// //     if (id === "report") {
// //       navigate("/admin-report");
// //       return;
// //     }
// //     if (id === "history") {
// //       navigate("/admin-history");
// //       return;
// //     }

// //     setActive(id);
// //   };

// //   if (!stats)
// //     return (
// //       <p className="text-center mt-40 text-xl text-purple-900 font-extrabold animate-pulse">
// //         Loading...
// //       </p>
// //     );

// //   return (
// //     <div className="flex min-h-screen bg-gray-200">
// //       {/* ✅ MOBILE MENU BUTTON (TOP-RIGHT so it doesn't cover titles/sidebar heading) */}
// //       <button
// //         className="md:hidden fixed top-4 right-4 z-50 bg-purple-600 text-white w-11 h-11 rounded-lg shadow flex items-center justify-center"
// //         onClick={() => setSidebarOpen((v) => !v)}
// //         aria-label="Toggle menu"
// //       >
// //         {sidebarOpen ? "✕" : "☰"}
// //       </button>

// //       {/* ✅ OVERLAY (mobile only) */}
// //       {sidebarOpen && (
// //         <div
// //           className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
// //           onClick={() => setSidebarOpen(false)}
// //         />
// //       )}

// //       {/* ✅ SIDEBAR */}
// //       <aside
// //         className={`fixed md:static z-40 h-full md:h-auto w-64 bg-purple-400 text-white pt-16 md:pt-6 p-6 shadow-xl
// //         transform transition-transform duration-300 ease-in-out
// //         ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
// //       >
// //         <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

// //         <ul className="space-y-4">
// //           {menu.map((item) => (
// //             <li
// //               key={item.id}
// //               onClick={() => handleMenu(item.id)}
// //               className={`cursor-pointer p-3 rounded-xl transition-all duration-300
// //               ${
// //                 active === item.id
// //                   ? "bg-white text-purple-600 font-bold shadow"
// //                   : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
// //               }`}
// //             >
// //               {item.label}
// //             </li>
// //           ))}
// //         </ul>
// //       </aside>

// //       {/* ✅ MAIN (add top padding on mobile so button never covers the page title) */}
// //       <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
// //         <h1 className="text-2xl md:text-4xl font-bold text-purple-600 mb-8">
// //           {active === "dashboard" && "Dashboard Overview"}
// //           {active === "report" && "Report Overview"}
// //           {active === "history" && "History Log"}
// //         </h1>

// //         {active === "dashboard" && (
// //           <>
// //             {/* STATS */}
// //             <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10">
// //               <StatCard
// //                 num={stats.totalParticipants || 0}
// //                 label="Total Participants"
// //               />
// //               <StatCard
// //                 num={Object.keys(stats.organizationBreakdown || {}).length}
// //                 label="Total Organizations"
// //               />
// //               <StatCard
// //                 num={stats.pendingPayments || 0}
// //                 label="Pending Payments Confirmation"
// //               />
// //             </div>

// //             {/* TABLE */}
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full bg-white rounded-xl shadow">
// //                 <thead className="bg-purple-400 text-white">
// //                   <tr>
// //                     <th className="p-2">Name</th>
// //                     <th className="p-2">Organization</th>
// //                     <th className="p-2">Phone</th>
// //                     <th className="p-2">Participants</th>
// //                     <th className="p-2">Proof</th>
// //                     <th className="p-2">Status</th>
// //                     <th className="p-2">Action</th>
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //                   {bookings.length === 0 ? (
// //                     <tr>
// //                       <td colSpan="7" className="p-6 text-gray-500 text-center">
// //                         No participant bookings yet
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     paginatedBookings.map((booking) => (
// //                       <tr
// //                         key={booking._id}
// //                         className="text-center border-b hover:bg-purple-50 transition"
// //                       >
// //                         <td>{booking.name || "—"}</td>
// //                         <td>{booking.organization || "—"}</td>
// //                         <td>{booking.phone || "—"}</td>
// //                         <td>{booking.participants ?? 0}</td>

// //                         <td>
// //                           {booking.paymentProof ? (
// //                             <a
// //                               href={
// //                                 booking.paymentProof?.startsWith("http")
// //                                   ? booking.paymentProof
// //                                   : `https://server-y72m.onrender.com/uploads/${encodeURIComponent(
// //                                       booking.paymentProof || "",
// //                                     )}`
// //                               }
// //                               target="_blank"
// //                               rel="noreferrer"
// //                               className="text-blue-600 underline"
// //                             >
// //                               View Proof
// //                             </a>
// //                           ) : (
// //                             "No proof"
// //                           )}
// //                         </td>

// //                         <td>
// //                           <span
// //                             className={`px-3 py-1 rounded text-white ${
// //                               booking.status === "Confirmed"
// //                                 ? "bg-green-500"
// //                                 : booking.status === "Rejected"
// //                                   ? "bg-red-500"
// //                                   : "bg-yellow-500"
// //                             }`}
// //                           >
// //                             {booking.status || "Pending"}
// //                           </span>
// //                         </td>

// //                         <td className="space-x-2">
// //                           <button
// //                             onClick={() => confirmPayment(booking._id)}
// //                             className="bg-green-500 text-white px-3 py-1 rounded hover:scale-105 transition"
// //                           >
// //                             Confirm
// //                           </button>

// //                           <button
// //                             onClick={() => rejectPayment(booking._id)}
// //                             className="bg-red-500 text-white px-3 py-1 rounded hover:scale-105 transition"
// //                           >
// //                             Reject
// //                           </button>

// //                           <button
// //                             onClick={() => deleteBooking(booking._id)}
// //                             className="bg-gray-700 text-white px-3 py-1 rounded hover:scale-105 transition"
// //                           >
// //                             Delete
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </table>

// //               {/* PAGINATION */}
// //               <div className="flex justify-center items-center gap-4 mt-6">
// //                 <button
// //                   disabled={page === 1}
// //                   onClick={() => setPage(page - 1)}
// //                   className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
// //                 >
// //                   Prev
// //                 </button>

// //                 <span className="font-semibold text-purple-700">
// //                   Page {page} / {totalPages}
// //                 </span>

// //                 <button
// //                   disabled={page === totalPages}
// //                   onClick={() => setPage(page + 1)}
// //                   className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
// //                 >
// //                   Next
// //                 </button>
// //               </div>
// //             </div>

// //             {/* ORG STATS */}
// //             <div className="mb-6 mt-6">
// //               <h2 className="text-lg md:text-xl font-bold mb-4">
// //                 Organization Participation
// //               </h2>

// //               {Object.entries(orgStats).map(([org, count]) => (
// //                 <div
// //                   key={org}
// //                   className="bg-white p-3 rounded mb-2 shadow hover:shadow-xl hover:-translate-y-1 transition"
// //                 >
// //                   {org} : {count} participants
// //                 </div>
// //               ))}
// //             </div>
// //           </>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // function StatCard({ num, label }) {
// //   return (
// //     <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition">
// //       <h2 className="text-xl sm:text-4xl font-bold text-purple-600 leading-tight">
// //         {num}
// //       </h2>
// //       <p className="text-[11px] sm:text-base text-gray-600 mt-1 sm:mt-2 leading-tight">
// //         {label}
// //       </p>
// //     </div>
// //   );
// // }
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import socket from "../socket";
// import api from "../services/api";

// export default function AdminDashboard() {
//   const navigate = useNavigate();

//   const [active, setActive] = useState("dashboard");
//   const [stats, setStats] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // ✅ inline edit state
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     name: "",
//     organization: "",
//     phone: "",
//     participants: 0,
//   });
//   const [saving, setSaving] = useState(false);

//   /* PAGINATION */
//   const [page, setPage] = useState(1);
//   const perPage = 8;
//   const totalPages = Math.ceil(bookings.length / perPage) || 1;

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [totalPages, page]);

//   const paginatedBookings = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return bookings.slice(start, start + perPage);
//   }, [bookings, page]);

//   /* ✅ LOCK BODY SCROLL WHEN SIDEBAR OPEN */
//   useEffect(() => {
//     if (!sidebarOpen) return;

//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [sidebarOpen]);

//   /* AUTH CHECK */
//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) navigate("/");
//     api.defaults.headers.common.Authorization = `Bearer ${token}`;
//   }, [navigate]);

//   /* REFRESH ONLY STATS */
//   const refreshStats = async () => {
//     try {
//       const statRes = await api.get("/admin/stats");
//       setStats(statRes.data || {});
//     } catch (err) {
//       console.error("Stats error:", err.response?.data || err.message);
//       setStats({
//         totalParticipants: 0,
//         pendingPayments: 0,
//         organizationBreakdown: {},
//         totalBookings: 0,
//       });
//     }
//   };

//   /* INITIAL LOAD */
//   const loadData = async () => {
//     try {
//       await refreshStats();

//       const bookRes = await api.get("/bookings");
//       const raw =
//         bookRes.data?.bookings ||
//         bookRes.data?.data ||
//         (Array.isArray(bookRes.data) ? bookRes.data : []);

//       const sortedBookings = (raw || []).sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
//       );

//       setBookings(sortedBookings);

//       const historyRes = await api.get("/history");
//       setHistory(historyRes.data || []);
//     } catch (err) {
//       console.error("Load error:", err.response?.data || err.message);
//       setBookings([]);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* REALTIME SOCKET */
//   useEffect(() => {
//     socket.off("newBooking");
//     socket.off("history");

//     socket.on("newBooking", async (newBooking) => {
//       setBookings((prev) => [newBooking, ...prev]);
//       setPage(1);
//       await refreshStats();
//     });

//     socket.on("history", (d) => setHistory((prev) => [d, ...prev]));

//     return () => {
//       socket.off("newBooking");
//       socket.off("history");
//     };
//   }, []);

//   /* PAYMENT ACTIONS */
//   const confirmPayment = async (id) => {
//     try {
//       await api.put(`/admin/confirm/${id}`);
//       setBookings((prev) =>
//         prev.map((b) => (b._id === id ? { ...b, status: "Confirmed" } : b)),
//       );
//       await refreshStats();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to confirm payment");
//     }
//   };

//   const rejectPayment = async (id) => {
//     try {
//       await api.put(`/admin/reject/${id}`);
//       setBookings((prev) =>
//         prev.map((b) => (b._id === id ? { ...b, status: "Rejected" } : b)),
//       );
//       await refreshStats();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to reject payment");
//     }
//   };

//   // ✅ Delete booking (requires your existing adminCleanup route)
//   const deleteBooking = async (id) => {
//     if (!window.confirm("Delete this booking permanently?")) return;
//     try {
//       await api.delete(`/admin/bookings/${id}`);
//       setBookings((prev) => prev.filter((b) => b._id !== id));
//       await refreshStats();
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err.message);
//       alert("Failed to delete booking");
//     }
//   };

//   /* ✅ INLINE EDIT */
//   const startEdit = (booking) => {
//     setEditingId(booking._id);
//     setEditForm({
//       name: booking.name || "",
//       organization: booking.organization || "",
//       phone: booking.phone || "",
//       participants: Number(booking.participants || 0),
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: "", organization: "", phone: "", participants: 0 });
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);

//       // ✅ requires PUT /api/admin/bookings/:id
//       const payload = {
//         name: (editForm.name || "").trim(),
//         organization: (editForm.organization || "").trim(),
//         phone: (editForm.phone || "").trim(),
//         participants: Number(editForm.participants || 0),
//       };

//       const res = await api.put(`/admin/bookings/${id}`, payload);
//       const updated = res.data?.booking || res.data || payload;

//       setBookings((prev) =>
//         prev.map((b) => (b._id === id ? { ...b, ...updated } : b)),
//       );

//       cancelEdit();
//       await refreshStats();
//     } catch (err) {
//       console.error("Update error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to update booking");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ORG STATS */
//   const orgStats = useMemo(() => {
//     return bookings.reduce((acc, b) => {
//       const org = b.organization || "N/A";
//       acc[org] = (acc[org] || 0) + (b.participants || 0);
//       return acc;
//     }, {});
//   }, [bookings]);

//   /* SIDEBAR MENU */
//   const menu = [
//     { id: "dashboard", label: "Dashboard Overview" },
//     { id: "report", label: "Report" },
//     { id: "history", label: "History Log" },
//     { id: "logout", label: "LOGOUT" },
//   ];

//   const handleMenu = (id) => {
//     setSidebarOpen(false);

//     if (id === "logout") {
//       localStorage.removeItem("adminToken");
//       navigate("/");
//       return;
//     }

//     if (id === "report") {
//       navigate("/admin-report");
//       return;
//     }
//     if (id === "history") {
//       navigate("/admin-history");
//       return;
//     }

//     setActive(id);
//   };

//   if (!stats)
//     return (
//       <p className="text-center mt-40 text-xl text-purple-900 font-extrabold animate-pulse">
//         Loading...
//       </p>
//     );

//   return (
//     <div className="flex min-h-screen bg-gray-200">
//       {/* ✅ MOBILE MENU BUTTON (same as AdminReport) */}
//       <button
//         onClick={() => setSidebarOpen((v) => !v)}
//         className="md:hidden fixed top-4 right-4 z-50 bg-purple-600 text-white w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300"
//         aria-label="Toggle menu"
//       >
//         <div className="relative w-6 h-6">
//           <span
//             className={`absolute left-0 top-1 w-6 h-[2px] bg-white transition-all duration-300 ${
//               sidebarOpen ? "rotate-45 top-3" : ""
//             }`}
//           />
//           <span
//             className={`absolute left-0 top-3 w-6 h-[2px] bg-white transition-all duration-300 ${
//               sidebarOpen ? "opacity-0" : ""
//             }`}
//           />
//           <span
//             className={`absolute left-0 top-5 w-6 h-[2px] bg-white transition-all duration-300 ${
//               sidebarOpen ? "-rotate-45 top-3" : ""
//             }`}
//           />
//         </div>
//       </button>

//       {/* ✅ OVERLAY */}
//       {sidebarOpen && (
//         <div
//           className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

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
//               onClick={() => handleMenu(item.id)}
//               className={`cursor-pointer p-3 rounded-xl transition-all duration-300
//               ${
//                 active === item.id
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
//       <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
//         <h1 className="text-2xl md:text-4xl font-bold text-purple-600 mb-8">
//           {active === "dashboard" && "Dashboard Overview"}
//           {active === "report" && "Report Overview"}
//           {active === "history" && "History Log"}
//         </h1>

//         {active === "dashboard" && (
//           <>
//             {/* STATS */}
//             <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10">
//               <StatCard
//                 num={stats.totalParticipants || 0}
//                 label="Total Participants"
//               />
//               <StatCard
//                 num={Object.keys(stats.organizationBreakdown || {}).length}
//                 label="Total Organizations"
//               />
//               <StatCard
//                 num={stats.pendingPayments || 0}
//                 label="Pending Payments Confirmation"
//               />
//             </div>

//             {/* TABLE */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-xl shadow">
//                 <thead className="bg-purple-400 text-white">
//                   <tr>
//                     <th className="p-2">Name</th>
//                     <th className="p-2">Organization</th>
//                     <th className="p-2">Phone</th>
//                     <th className="p-2">Participants</th>
//                     <th className="p-2">Proof</th>
//                     <th className="p-2">Status</th>
//                     <th className="p-2">Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {bookings.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="p-6 text-gray-500 text-center">
//                         No participant bookings yet
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedBookings.map((booking) => {
//                       const isEditing = editingId === booking._id;

//                       return (
//                         <tr
//                           key={booking._id}
//                           className="text-center border-b hover:bg-purple-50 transition"
//                         >
//                           {/* NAME */}
//                           <td className="p-2">
//                             {isEditing ? (
//                               <input
//                                 value={editForm.name}
//                                 onChange={(e) =>
//                                   setEditForm((p) => ({
//                                     ...p,
//                                     name: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
//                               />
//                             ) : (
//                               booking.name || "—"
//                             )}
//                           </td>

//                           {/* ORG */}
//                           <td className="p-2">
//                             {isEditing ? (
//                               <input
//                                 value={editForm.organization}
//                                 onChange={(e) =>
//                                   setEditForm((p) => ({
//                                     ...p,
//                                     organization: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
//                               />
//                             ) : (
//                               booking.organization || "—"
//                             )}
//                           </td>

//                           {/* PHONE */}
//                           <td className="p-2">
//                             {isEditing ? (
//                               <input
//                                 value={editForm.phone}
//                                 onChange={(e) =>
//                                   setEditForm((p) => ({
//                                     ...p,
//                                     phone: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
//                               />
//                             ) : (
//                               booking.phone || "—"
//                             )}
//                           </td>

//                           {/* PARTICIPANTS */}
//                           <td className="p-2">
//                             {isEditing ? (
//                               <input
//                                 type="number"
//                                 min="0"
//                                 value={editForm.participants}
//                                 onChange={(e) =>
//                                   setEditForm((p) => ({
//                                     ...p,
//                                     participants: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
//                               />
//                             ) : (
//                               (booking.participants ?? 0)
//                             )}
//                           </td>

//                           {/* PROOF */}
//                           <td className="p-2">
//                             {booking.paymentProof ? (
//                               <a
//                                 href={
//                                   booking.paymentProof?.startsWith("http")
//                                     ? booking.paymentProof
//                                     : `https://server-y72m.onrender.com/uploads/${encodeURIComponent(
//                                         booking.paymentProof || "",
//                                       )}`
//                                 }
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="text-blue-600 underline"
//                               >
//                                 View Proof
//                               </a>
//                             ) : (
//                               "No proof"
//                             )}
//                           </td>

//                           {/* STATUS */}
//                           <td className="p-2">
//                             <span
//                               className={`px-3 py-1 rounded text-white ${
//                                 booking.status === "Confirmed"
//                                   ? "bg-green-500"
//                                   : booking.status === "Rejected"
//                                     ? "bg-red-500"
//                                     : "bg-yellow-500"
//                               }`}
//                             >
//                               {booking.status || "Pending"}
//                             </span>
//                           </td>

//                           {/* ACTIONS */}
//                           <td className="p-2">
//                             {isEditing ? (
//                               <div className="flex flex-wrap justify-center gap-2">
//                                 <button
//                                   disabled={saving}
//                                   onClick={() => saveEdit(booking._id)}
//                                   className="bg-purple-600 text-white px-3 py-1 rounded hover:scale-105 transition disabled:opacity-40"
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   disabled={saving}
//                                   onClick={cancelEdit}
//                                   className="bg-gray-600 text-white px-3 py-1 rounded hover:scale-105 transition disabled:opacity-40"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="flex flex-wrap justify-center gap-2">
//                                 <button
//                                   onClick={() => confirmPayment(booking._id)}
//                                   className="bg-green-500 text-white px-3 py-1 rounded hover:scale-105 transition"
//                                 >
//                                   Confirm
//                                 </button>

//                                 <button
//                                   onClick={() => rejectPayment(booking._id)}
//                                   className="bg-red-500 text-white px-3 py-1 rounded hover:scale-105 transition"
//                                 >
//                                   Reject
//                                 </button>

//                                 <button
//                                   onClick={() => startEdit(booking)}
//                                   className="bg-blue-600 text-white px-3 py-1 rounded hover:scale-105 transition"
//                                 >
//                                   Edit
//                                 </button>

//                                 <button
//                                   onClick={() => deleteBooking(booking._id)}
//                                   className="bg-gray-700 text-white px-3 py-1 rounded hover:scale-105 transition"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>

//               {/* PAGINATION */}
//               <div className="flex justify-center items-center gap-4 mt-6">
//                 <button
//                   disabled={page === 1}
//                   onClick={() => setPage(page - 1)}
//                   className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
//                 >
//                   Prev
//                 </button>

//                 <span className="font-semibold text-purple-700">
//                   Page {page} / {totalPages}
//                 </span>

//                 <button
//                   disabled={page === totalPages}
//                   onClick={() => setPage(page + 1)}
//                   className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>

//             {/* ORG STATS */}
//             <div className="mb-6 mt-6">
//               <h2 className="text-lg md:text-xl font-bold mb-4">
//                 Organization Participation
//               </h2>

//               {Object.entries(orgStats).map(([org, count]) => (
//                 <div
//                   key={org}
//                   className="bg-white p-3 rounded mb-2 shadow hover:shadow-xl hover:-translate-y-1 transition"
//                 >
//                   {org} : {count} participants
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// function StatCard({ num, label }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition">
//       <h2 className="text-xl sm:text-4xl font-bold text-purple-600 leading-tight">
//         {num}
//       </h2>
//       <p className="text-[11px] sm:text-base text-gray-600 mt-1 sm:mt-2 leading-tight">
//         {label}
//       </p>
//     </div>
//   );
// }
import { useEffect, useState, useMemo, useRef } from "react";
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

  // ✅ search + filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ realtime notification count
  const [notifCount, setNotifCount] = useState(0);
  const tableTopRef = useRef(null);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const perPage = 8;

  /* ✅ LOCK BODY SCROLL WHEN SIDEBAR OPEN */
  useEffect(() => {
    if (!sidebarOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  /* AUTH CHECK */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/");
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
      setNotifCount((c) => c + 1); // ✅ increment badge
      await refreshStats();
    });

    socket.on("history", (d) => setHistory((prev) => [d, ...prev]));

    return () => {
      socket.off("newBooking");
      socket.off("history");
    };
  }, []);

  /* PAYMENT ACTIONS */
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

  // ✅ delete action (uses your /api/admin/bookings/:id route)
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      await refreshStats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
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
      return;
    }

    if (id === "report") {
      navigate("/admin-report");
      return;
    }
    if (id === "history") {
      navigate("/admin-history");
      return;
    }

    setActive(id);
  };

  // ✅ filter + search (before pagination)
  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();

    return bookings.filter((b) => {
      const statusOk =
        statusFilter === "All" ? true : b.status === statusFilter;

      if (!q) return statusOk;

      const hay = [
        b.name,
        b.organization,
        b.phone,
        b.status,
        String(b.participants ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return statusOk && hay.includes(q);
    });
  }, [bookings, search, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / perPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredBookings.slice(start, start + perPage);
  }, [filteredBookings, page]);

  // ✅ notification click behavior
  const openNotifications = () => {
    setNotifCount(0);
    tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!stats)
    return (
      <p className="text-center mt-40 text-xl text-purple-900 font-extrabold animate-pulse">
        Loading...
      </p>
    );

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* ✅ MOBILE MENU BUTTON (TOP-RIGHT) */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-purple-600 text-white w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300"
        onClick={() => setSidebarOpen((v) => !v)}
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
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`fixed md:static z-40 h-full md:h-auto w-64 bg-purple-400 text-white pt-16 md:pt-6 p-6 shadow-xl
        transform transition-transform duration-300 ease-in-out
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

      {/* ✅ MAIN */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="flex items-start justify-between gap-3 mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
            {active === "dashboard" && "Dashboard Overview"}
            {active === "report" && "Report Overview"}
            {active === "history" && "History Log"}
          </h1>

          {/* ✅ notification bell */}
          <button
            onClick={openNotifications}
            className="relative bg-white text-purple-700 px-4 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
            title="New bookings"
          >
            🔔
            {notifCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow">
                {notifCount}
              </span>
            )}
          </button>
        </div>

        {active === "dashboard" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6">
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

            {/* ✅ SEARCH + FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name / org / phone / status..."
                className="w-full sm:w-[420px] bg-white rounded-full px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white rounded-full px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={loadData}
                  className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:shadow-xl hover:-translate-y-[1px] transition font-semibold"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto" ref={tableTopRef}>
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
                  {filteredBookings.length === 0 ? (
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
                        <td>{booking.name || "—"}</td>
                        <td>{booking.organization || "—"}</td>
                        <td>{booking.phone || "—"}</td>
                        <td>{booking.participants ?? 0}</td>

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

                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="bg-gray-700 text-white px-3 py-1 rounded hover:scale-105 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              {filteredBookings.length > 0 && (
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
