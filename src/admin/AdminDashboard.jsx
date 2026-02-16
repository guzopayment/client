// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// export default function AdminAnalyticsDashboard() {
//   const [stats, setStats] = useState({
//     users: [],
//     sales: [],
//   });

//   useEffect(() => {
//     async function fetchAnalytics() {
//       try {
//         const res = await fetch("/api/admin/analytics");
//         const data = await res.json();
//         setStats(data);
//       } catch (err) {
//         console.error("Analytics fetch error", err);
//       }
//     }

//     fetchAnalytics();
//   }, []);

//   return (
//     <div className="p-6 grid gap-6">
//       <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>

//       <div className="grid md:grid-cols-2 gap-6">
//         <Card className="rounded-2xl shadow">
//           <CardContent className="p-4">
//             <h2 className="text-xl font-semibold mb-4">User Growth</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={stats.users}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="count" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow">
//           <CardContent className="p-4">
//             <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={stats.sales}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="total" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // /*
// //  COMPLETE API-CONNECTED ADMIN DASHBOARD TEMPLATE
// //  - Mobile responsive SaaS layout
// //  - Sidebar + topbar
// //  - Real API data fetching
// //  - Pagination ready
// //  - Error/loading states
// //  - Platform independent (works any backend REST API)

// //  CHANGE ONLY:
// //  const API = "http://localhost:5000/api";
// // */

// // const API = "http://localhost:5000/api";

// // export default function AdminDashboard() {
// //   const [stats, setStats] = useState(null);
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   /* pagination */
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   /* ---------------- FETCH DATA ---------------- */

// //   const fetchDashboard = async () => {
// //     try {
// //       setLoading(true);

// //       const statRes = await axios.get(`${API}/admin/stats`);
// //       setStats(statRes.data);

// //       const userRes = await axios.get(`${API}/bookings?page=${page}&limit=10`);

// //       /* support ANY backend format */
// //       const data = userRes.data?.data || userRes.data?.bookings || userRes.data;
// //       setUsers(Array.isArray(data) ? data : []);

// //       setTotalPages(userRes.data?.totalPages || 1);
// //     } catch (err) {
// //       console.error(err);
// //       setError("API connection failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDashboard();
// //   }, [page]);

// //   /* ---------------- UI ---------------- */

// //   return (
// //     <div className="flex min-h-screen bg-gray-100">
// //       {/* SIDEBAR */}
// //       <aside className="hidden md:block w-64 bg-purple-600 text-white p-6">
// //         <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

// //         <nav className="space-y-4">
// //           <p className="cursor-pointer hover:text-gray-200">Dashboard</p>
// //           <p className="cursor-pointer hover:text-gray-200">Reports</p>
// //           <p className="cursor-pointer hover:text-gray-200">Users</p>
// //           <p className="cursor-pointer hover:text-gray-200">Settings</p>
// //         </nav>
// //       </aside>

// //       {/* MAIN */}
// //       <main className="flex-1 p-6">
// //         <h1 className="text-3xl font-bold mb-6 text-purple-700">
// //           Admin Dashboard
// //         </h1>

// //         {/* LOADING */}
// //         {loading && <p className="text-center text-lg">Loading dashboard...</p>}

// //         {/* ERROR */}
// //         {error && <p className="text-red-600 text-center font-bold">{error}</p>}

// //         {/* STATS */}
// //         {stats && (
// //           <div className="grid md:grid-cols-3 gap-6 mb-10">
// //             <StatCard label="Participants" value={stats.totalParticipants} />
// //             <StatCard label="Pending" value={stats.pendingPayments} />
// //             <StatCard
// //               label="Organizations"
// //               value={Object.keys(stats.organizationBreakdown || {}).length}
// //             />
// //           </div>
// //         )}

// //         {/* TABLE */}
// //         <div className="overflow-x-auto bg-white rounded-xl shadow">
// //           <table className="min-w-full">
// //             <thead className="bg-purple-500 text-white">
// //               <tr>
// //                 <th className="p-3">Name</th>
// //                 <th>Organization</th>
// //                 <th>Phone</th>
// //                 <th>Participants</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {users.length === 0 && !loading ? (
// //                 <tr>
// //                   <td colSpan="4" className="text-center p-6">
// //                     No data found
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 users.map((u, i) => (
// //                   <tr key={u._id || i} className="border-b text-center">
// //                     <td className="p-2">{u.fullName || "N/A"}</td>
// //                     <td>{u.organization || "N/A"}</td>
// //                     <td>{u.phone || "N/A"}</td>
// //                     <td>{u.participants || 0}</td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* PAGINATION */}
// //         <div className="flex justify-center mt-6 gap-4 flex-wrap">
// //           <button
// //             onClick={() => setPage((p) => Math.max(1, p - 1))}
// //             className="px-4 py-2 bg-purple-500 text-white rounded"
// //           >
// //             Prev
// //           </button>

// //           <span className="font-bold">
// //             Page {page} / {totalPages}
// //           </span>

// //           <button
// //             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
// //             className="px-4 py-2 bg-purple-500 text-white rounded"
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // function StatCard({ label, value }) {
// //   return (
// //     <div className="bg-white rounded-xl shadow p-6 text-center">
// //       <h2 className="text-3xl font-bold text-purple-600">{value}</h2>
// //       <p className="text-gray-600">{label}</p>
// //     </div>
// //   );
// // }
// // // import { useState } from "react";
// // // import { Home, Users, BarChart3, Settings, Bell } from "lucide-react";

// // // export default function AdminDashboardTemplate() {
// // //   const [sidebarOpen, setSidebarOpen] = useState(false);

// // //   return (
// // //     <div className="flex min-h-screen bg-gray-100">
// // //       {/* Sidebar */}
// // //       <aside
// // //         className={`fixed md:static z-40 bg-purple-700 text-white w-64 h-full p-6 transform transition-transform duration-300 ${
// // //           sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
// // //         }`}
// // //       >
// // //         <h2 className="text-2xl font-bold mb-8">Admin SaaS</h2>

// // //         <nav className="space-y-5">
// // //           <MenuItem icon={<Home />} label="Dashboard" />
// // //           <MenuItem icon={<Users />} label="Users" />
// // //           <MenuItem icon={<BarChart3 />} label="Analytics" />
// // //           <MenuItem icon={<Settings />} label="Settings" />
// // //         </nav>
// // //       </aside>

// // //       {/* Main */}
// // //       <div className="flex-1 flex flex-col">
// // //         {/* Header */}
// // //         <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
// // //           <button
// // //             className="md:hidden"
// // //             onClick={() => setSidebarOpen(!sidebarOpen)}
// // //           >
// // //             ☰
// // //           </button>

// // //           <h1 className="text-xl font-bold">Admin Dashboard</h1>

// // //           <div className="relative">
// // //             <Bell />
// // //             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
// // //               3
// // //             </span>
// // //           </div>
// // //         </header>

// // //         {/* Content */}
// // //         <main className="p-6 space-y-6">
// // //           {/* Stats */}
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // //             <StatCard title="Users" value="1,240" />
// // //             <StatCard title="Revenue" value="$8,200" />
// // //             <StatCard title="Bookings" value="320" />
// // //             <StatCard title="Growth" value="+18%" />
// // //           </div>

// // //           {/* Table */}
// // //           <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
// // //             <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>

// // //             <table className="min-w-full">
// // //               <thead className="bg-purple-600 text-white">
// // //                 <tr>
// // //                   <th className="p-2">Name</th>
// // //                   <th className="p-2">Phone</th>
// // //                   <th className="p-2">Status</th>
// // //                 </tr>
// // //               </thead>

// // //               <tbody>
// // //                 {[1, 2, 3].map((i) => (
// // //                   <tr key={i} className="text-center border-b">
// // //                     <td>User {i}</td>
// // //                     <td>091234567{i}</td>
// // //                     <td>
// // //                       <span className="bg-green-500 text-white px-2 py-1 rounded">
// // //                         Confirmed
// // //                       </span>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </main>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function MenuItem({ icon, label }) {
// // //   return (
// // //     <div className="flex items-center gap-3 cursor-pointer hover:bg-purple-600 p-2 rounded">
// // //       {icon}
// // //       {label}
// // //     </div>
// // //   );
// // // }

// // // function StatCard({ title, value }) {
// // //   return (
// // //     <div className="bg-white rounded-2xl shadow p-6 text-center">
// // //       <p className="text-gray-500">{title}</p>
// // //       <h2 className="text-3xl font-bold text-purple-600">{value}</h2>
// // //     </div>
// // //   );
// // // }

// // // // import AdminLayout from "./AdminLayout";
// // // // import StatsCards from "./StatsCards";
// // // // import BookingTable from "./BookingTable";

// // // // export default function AdminDashboard() {
// // // //   return (
// // // //     <AdminLayout>
// // // //       <StatsCards />
// // // //       <BookingTable />
// // // //     </AdminLayout>
// // // //   );
// // // // }
