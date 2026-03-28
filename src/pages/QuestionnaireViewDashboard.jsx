// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import api from "../services/api";
// import MessageModal from "../components/MessageModal";

// export default function QuestionnairViewDashboard() {
//   const navigate = useNavigate();

//   const [rows, setRows] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [orgTablePage, setOrgTablePage] = useState(1);
//   const orgTablePerPage = 10;

//   const [orgGroupPage, setOrgGroupPage] = useState(1);
//   const orgGroupsPerPage = 4;

//   const [organizationSearch, setOrganizationSearch] = useState("");

//   // per-group inner table pagination
//   const [groupRowPages, setGroupRowPages] = useState({});
//   const groupRowsPerPage = 8;

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState("info");

//   const showModal = (title, message, type = "info") => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setModalType(type);
//     setModalOpen(true);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) {
//       navigate("/");
//       return;
//     }
//     api.defaults.headers.common.Authorization = `Bearer ${token}`;
//   }, [navigate]);

//   useEffect(() => {
//     if (!sidebarOpen) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [sidebarOpen]);

//   const loadRows = async () => {
//     try {
//       const res = await api.get("/questionnaire");
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.data || res.data?.rows || res.data?.questionnaires || [];
//       setRows(data);
//     } catch (err) {
//       console.error(
//         "Questionnaire dashboard load error:",
//         err.response?.data || err.message,
//       );
//       setRows([]);
//       showModal(
//         "Error",
//         "Failed to load questionnaire dashboard data",
//         "error",
//       );
//     }
//   };

//   useEffect(() => {
//     loadRows();
//   }, []);

//   const normalizeText = (value) =>
//     String(value || "")
//       .replace(/\s+/g, " ")
//       .trim();

//   const totalOrganizations = useMemo(() => {
//     return new Set(
//       rows.map((r) => normalizeText(r.organization)).filter(Boolean),
//     ).size;
//   }, [rows]);

//   const totalSubCities = useMemo(() => {
//     return new Set(rows.map((r) => normalizeText(r.subCity)).filter(Boolean))
//       .size;
//   }, [rows]);

//   const topNearChurch = useMemo(() => {
//     const map = {};
//     rows.forEach((r) => {
//       const key = normalizeText(r.nearChurch) || "N/A";
//       map[key] = (map[key] || 0) + 1;
//     });

//     return Object.entries(map)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
//   }, [rows]);

//   const bySubCity = useMemo(() => {
//     const map = {};
//     rows.forEach((r) => {
//       const key = normalizeText(r.subCity) || "N/A";
//       map[key] = (map[key] || 0) + 1;
//     });

//     return Object.entries(map)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
//   }, [rows]);

//   const byOrganization = useMemo(() => {
//     const map = {};
//     rows.forEach((r) => {
//       const key = normalizeText(r.organization) || "N/A";
//       map[key] = (map[key] || 0) + 1;
//     });

//     return Object.entries(map)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);
//   }, [rows]);

//   const organizationSummaryRows = useMemo(() => {
//     const map = {};

//     rows.forEach((r) => {
//       const org = normalizeText(r.organization) || "N/A";

//       if (!map[org]) {
//         map[org] = {
//           organization: org,
//           totalRecords: 0,
//           subCities: new Set(),
//           nearChurches: new Set(),
//         };
//       }

//       map[org].totalRecords += 1;
//       if (normalizeText(r.subCity))
//         map[org].subCities.add(normalizeText(r.subCity));
//       if (normalizeText(r.nearChurch)) {
//         map[org].nearChurches.add(normalizeText(r.nearChurch));
//       }
//     });

//     return Object.values(map)
//       .map((item) => ({
//         organization: item.organization,
//         totalRecords: item.totalRecords,
//         subCityCount: item.subCities.size,
//         nearChurchCount: item.nearChurches.size,
//       }))
//       .sort((a, b) => b.totalRecords - a.totalRecords);
//   }, [rows]);

//   const totalOrgTablePages =
//     Math.ceil(organizationSummaryRows.length / orgTablePerPage) || 1;

//   useEffect(() => {
//     if (orgTablePage > totalOrgTablePages) setOrgTablePage(totalOrgTablePages);
//   }, [orgTablePage, totalOrgTablePages]);

//   const paginatedOrganizationSummaryRows = useMemo(() => {
//     const start = (orgTablePage - 1) * orgTablePerPage;
//     return organizationSummaryRows.slice(start, start + orgTablePerPage);
//   }, [organizationSummaryRows, orgTablePage]);

//   const groupedByOrganizationList = useMemo(() => {
//     const q = normalizeText(organizationSearch).toLowerCase();

//     const grouped = rows.reduce((acc, item) => {
//       const key = normalizeText(item.organization) || "N/A";

//       if (q && !key.toLowerCase().includes(q)) return acc;

//       if (!acc[key]) {
//         acc[key] = {
//           organization: key,
//           rows: [],
//         };
//       }
//       acc[key].rows.push(item);
//       return acc;
//     }, {});

//     return Object.values(grouped).sort((a, b) => b.rows.length - a.rows.length);
//   }, [rows, organizationSearch]);

//   useEffect(() => {
//     setOrgGroupPage(1);
//     setGroupRowPages({});
//   }, [organizationSearch, rows]);

//   const totalOrgGroupPages =
//     Math.ceil(groupedByOrganizationList.length / orgGroupsPerPage) || 1;

//   useEffect(() => {
//     if (orgGroupPage > totalOrgGroupPages) setOrgGroupPage(totalOrgGroupPages);
//   }, [orgGroupPage, totalOrgGroupPages]);

//   const paginatedGroupedByOrganization = useMemo(() => {
//     const start = (orgGroupPage - 1) * orgGroupsPerPage;
//     return groupedByOrganizationList.slice(start, start + orgGroupsPerPage);
//   }, [groupedByOrganizationList, orgGroupPage]);

//   const getGroupRowPage = (organization) => groupRowPages[organization] || 1;

//   const setGroupPage = (organization, page) => {
//     setGroupRowPages((prev) => ({
//       ...prev,
//       [organization]: page,
//     }));
//   };

//   const getGroupTotalPages = (group) =>
//     Math.ceil(group.rows.length / groupRowsPerPage) || 1;

//   const getPaginatedGroupRows = (group) => {
//     const currentPage = getGroupRowPage(group.organization);
//     const start = (currentPage - 1) * groupRowsPerPage;
//     return group.rows.slice(start, start + groupRowsPerPage);
//   };

//   const buildExportRow = (r, index) => ({
//     No: index + 1,
//     QuestionnaireId: r.questionnaireId || "",
//     FirstName: r.firstName || "",
//     MiddleName: r.middleName || "",
//     LastName: r.lastName || "",
//     FullName: `${r.firstName || ""} ${r.middleName || ""} ${r.lastName || ""}`
//       .replace(/\s+/g, " ")
//       .trim(),
//     Phone: r.phone || "",
//     AltPhone: r.altPhone || "",
//     Organization: r.organization || "",
//     Sex: r.sex || "",
//     GraduatedField: r.graduatedField || "",
//     CurrentJob: r.currentJob || "",
//     SubCity: r.subCity || "",
//     Woreda: r.woreda || "",
//     Kebele: r.kebele || "",
//     SpecificPlace: r.specificPlace || "",
//     NearChurch: r.nearChurch || "",
//     HouseType: r.houseType || "",
//     CreatedAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
//     UpdatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "",
//   });

//   const exportOrganizationExcel = (group) => {
//     try {
//       const data = group.rows.map((r, index) => buildExportRow(r, index));

//       const worksheet = XLSX.utils.json_to_sheet(data);

//       const columnWidths = [
//         { wch: 6 }, // No
//         { wch: 18 }, // QuestionnaireId
//         { wch: 18 }, // FirstName
//         { wch: 18 }, // MiddleName
//         { wch: 18 }, // LastName
//         { wch: 28 }, // FullName
//         { wch: 16 }, // Phone
//         { wch: 16 }, // AltPhone
//         { wch: 36 }, // Organization
//         { wch: 12 }, // Sex
//         { wch: 22 }, // GraduatedField
//         { wch: 22 }, // CurrentJob
//         { wch: 24 }, // SubCity
//         { wch: 12 }, // Woreda
//         { wch: 12 }, // Kebele
//         { wch: 24 }, // SpecificPlace
//         { wch: 24 }, // NearChurch
//         { wch: 18 }, // HouseType
//         { wch: 22 }, // CreatedAt
//         { wch: 22 }, // UpdatedAt
//       ];
//       worksheet["!cols"] = columnWidths;

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Organization Data");

//       XLSX.writeFile(
//         workbook,
//         `${group.organization.replace(/[\\/:*?"<>|]/g, "_")}-questionnaires.xlsx`,
//       );

//       showModal(
//         "Success",
//         "Organization Excel exported successfully",
//         "success",
//       );
//     } catch (err) {
//       console.error("Organization Excel export error:", err);
//       showModal("Error", "Failed to export organization Excel", "error");
//     }
//   };

//   const exportOrganizationPDF = (group) => {
//     try {
//       const doc = new jsPDF("l", "mm", "a4");

//       doc.setFontSize(16);
//       doc.text(`Organization: ${group.organization}`, 14, 16);
//       doc.setFontSize(10);
//       doc.text(`Total Records: ${group.rows.length}`, 14, 22);

//       autoTable(doc, {
//         startY: 28,
//         head: [
//           [
//             "No",
//             "Questionnaire ID",
//             "First Name",
//             "Middle Name",
//             "Last Name",
//             "Phone",
//             "Alt Phone",
//             "Organization",
//             "Sex",
//             "Graduated Field",
//             "Current Job",
//             "Sub City",
//             "Woreda",
//             "Kebele",
//             "Specific Place",
//             "Near Church",
//             "House Type",
//           ],
//         ],
//         body: group.rows.map((r, index) => [
//           index + 1,
//           r.questionnaireId || "",
//           r.firstName || "",
//           r.middleName || "",
//           r.lastName || "",
//           r.phone || "",
//           r.altPhone || "",
//           r.organization || "",
//           r.sex || "",
//           r.graduatedField || "",
//           r.currentJob || "",
//           r.subCity || "",
//           r.woreda || "",
//           r.kebele || "",
//           r.specificPlace || "",
//           r.nearChurch || "",
//           r.houseType || "",
//         ]),
//         styles: {
//           fontSize: 6,
//           cellPadding: 1.5,
//           overflow: "linebreak",
//           halign: "left",
//           valign: "middle",
//         },
//         headStyles: {
//           fillColor: [126, 34, 206],
//           fontSize: 6,
//         },
//         margin: { left: 6, right: 6 },
//         tableWidth: "auto",
//         theme: "grid",
//       });

//       doc.save(
//         `${group.organization.replace(/[\\/:*?"<>|]/g, "_")}-questionnaires.pdf`,
//       );

//       showModal("Success", "Organization PDF exported successfully", "success");
//     } catch (err) {
//       console.error("Organization PDF export error:", err);
//       showModal("Error", "Failed to export organization PDF", "error");
//     }
//   };

//   const menu = [
//     // { id: "dashboard", label: "Travel Overview", path: "/admin-dashboard" },
//     // { id: "report", label: "Travel Report", path: "/admin-report" },
//     {
//       id: "questionnaire",
//       label: "Questionnaire Data",
//       path: "/admin-questionnaire",
//     },
//     {
//       id: "questionnaire-view-dashboard",
//       label: "Questionnaire View Org",
//       path: "/questionnaire-view-dashboard",
//     },
//     { id: "history", label: " History Log", path: "/admin-history" },
//     { id: "logout", label: "LOGOUT", action: "logout" },
//   ];

//   const handleMenu = (item) => {
//     setSidebarOpen(false);
//     if (item.action === "logout") {
//       localStorage.removeItem("adminToken");
//       navigate("/admin-login");
//       return;
//     }
//     if (item.path) navigate(item.path);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-200 min-w-fit">
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
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

//       {sidebarOpen && (
//         <div
//           className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed md:static z-40 h-full md:h-auto w-64 bg-purple-400 text-white pt-16 md:pt-6 p-6 shadow-xl
//         transform transition-transform duration-300
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

//         <ul className="space-y-4">
//           {menu.map((item) => (
//             <li
//               key={item.id}
//               onClick={() => handleMenu(item)}
//               className={`cursor-pointer p-3 rounded-xl transition-all duration-300 ${
//                 item.id === "questionnaire-view-dashboard"
//                   ? "bg-white text-purple-600 font-bold shadow"
//                   : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
//               }`}
//             >
//               {item.label}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
//           <div>
//             <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
//               Questionnaire View Dashboard
//             </h1>
//           </div>
//         </div>

//         <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
//           Quick Overview
//         </h1>

//         <div className="grid grid-cols-4 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-6 mt-4">
//           <DualMetricCard
//             title="Organization & Sub-City"
//             firstLabel="Total Organizations"
//             firstValue={totalOrganizations}
//             secondLabel="Total Sub-Cities"
//             secondValue={totalSubCities}
//           />

//           <MiniChartCard title="Top 5 Near Churches" items={topNearChurch} />
//           <MiniChartCard title="By Sub-City" items={bySubCity} />
//           <MiniChartCard title="By Organization" items={byOrganization} />
//         </div>

//         <div className="bg-white rounded-2xl shadow p-4 md:p-5 mb-8 hover:shadow-2xl hover:-translate-y-1 transition">
//           <div className="flex items-center justify-between gap-3 mb-4">
//             <h2 className="text-lg md:text-2xl font-bold text-purple-700">
//               Organization Table Real Data
//             </h2>

//             <button
//               onClick={loadRows}
//               className="bg-purple-600 text-white px-4 py-2 rounded-full shadow hover:bg-purple-700 hover:scale-105 transition text-xs md:text-sm"
//             >
//               Refresh
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-[640px] bg-white rounded-xl shadow">
//               <thead className="bg-purple-400 text-white">
//                 <tr>
//                   <th className="p-2 text-xs md:text-sm">Organization</th>
//                   <th className="p-2 text-xs md:text-sm">Total Records</th>
//                   <th className="p-2 text-xs md:text-sm">Sub-Cities</th>
//                   <th className="p-2 text-xs md:text-sm">Near Churches</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedOrganizationSummaryRows.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="p-6 text-center text-gray-500 text-sm"
//                     >
//                       No organization data found
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedOrganizationSummaryRows.map((item) => (
//                     <tr
//                       key={item.organization}
//                       className="text-center border-b hover:bg-purple-50 transition hover:shadow-md"
//                     >
//                       <td className="p-2 text-xs md:text-sm">
//                         {item.organization}
//                       </td>
//                       <td className="p-2 text-xs md:text-sm">
//                         {item.totalRecords}
//                       </td>
//                       <td className="p-2 text-xs md:text-sm">
//                         {item.subCityCount}
//                       </td>
//                       <td className="p-2 text-xs md:text-sm">
//                         {item.nearChurchCount}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             {organizationSummaryRows.length > 0 && (
//               <div className="flex justify-center items-center gap-4 mt-6">
//                 <button
//                   disabled={orgTablePage === 1}
//                   onClick={() => setOrgTablePage((p) => p - 1)}
//                   className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
//                 >
//                   Prev
//                 </button>

//                 <span className="font-semibold text-purple-700 text-sm">
//                   Page {orgTablePage} / {totalOrgTablePages}
//                 </span>

//                 <button
//                   disabled={orgTablePage === totalOrgTablePages}
//                   onClick={() => setOrgTablePage((p) => p + 1)}
//                   className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
//           <div>
//             <h1 className="text-lg md:text-4xl font-bold text-purple-600">
//               Grouped by Organization
//             </h1>
//             <p className="text-xs md:text-sm text-gray-500 mt-1">
//               Search organization and export full questionnaire fields.
//             </p>
//           </div>

//           <div className="w-full md:w-[420px]">
//             <input
//               value={organizationSearch}
//               onChange={(e) => setOrganizationSearch(e.target.value)}
//               placeholder="Search organization..."
//               className="w-full bg-white rounded-full px-4 md:px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
//             />
//           </div>
//         </div>

//         <div className="space-y-6 md:space-y-8">
//           {paginatedGroupedByOrganization.map((group, idx) => {
//             const currentInnerPage = getGroupRowPage(group.organization);
//             const totalInnerPages = getGroupTotalPages(group);
//             const groupRowsPage = getPaginatedGroupRows(group);

//             return (
//               <div
//                 key={`${group.organization}-${idx}`}
//                 className="bg-white rounded-2xl shadow p-3 md:p-4 hover:shadow-2xl hover:-translate-y-1 transition"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
//                   <div>
//                     <h2 className="text-base md:text-xl font-bold text-purple-700">
//                       {group.organization}
//                     </h2>
//                     <p className="text-xs md:text-sm text-gray-500">
//                       Total Records: {group.rows.length}
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap gap-2 md:gap-3">
//                     <button
//                       onClick={() => exportOrganizationExcel(group)}
//                       className="bg-green-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-green-700 hover:scale-105 transition text-xs md:text-sm"
//                     >
//                       Export Excel
//                     </button>

//                     <button
//                       onClick={() => exportOrganizationPDF(group)}
//                       className="bg-red-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-red-700 hover:scale-105 transition text-xs md:text-sm"
//                     >
//                       Export PDF
//                     </button>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-[1200px] bg-white rounded-xl border">
//                     <thead className="bg-purple-100">
//                       <tr>
//                         <th className="p-2 text-xs md:text-sm">Questionnaire ID</th>
//                         <th className="p-2 text-xs md:text-sm">Full Name</th>
//                         <th className="p-2 text-xs md:text-sm">Phone</th>
//                         <th className="p-2 text-xs md:text-sm">Alt Phone</th>
//                         <th className="p-2 text-xs md:text-sm">Sex</th>
//                         <th className="p-2 text-xs md:text-sm">Sub City</th>
//                         <th className="p-2 text-xs md:text-sm">Woreda</th>
//                         <th className="p-2 text-xs md:text-sm">Kebele</th>
//                         <th className="p-2 text-xs md:text-sm">Near Church</th>
//                         <th className="p-2 text-xs md:text-sm">Current Job</th>
//                         <th className="p-2 text-xs md:text-sm">
//                           Graduated Field
//                         </th>
//                         <th className="p-2 text-xs md:text-sm">House Type</th>
//                         <th className="p-2 text-xs md:text-sm">
//                           Specific Place
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {groupRowsPage.map((r) => (
//                         <tr
//                           key={r._id}
//                           className="text-center border-b hover:bg-purple-50 transition"
//                         >
//                           <td className="p-2 text-xs md:text-sm font-semibold text-purple-700">
//                             {r.questionnaireId || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {`${r.firstName || ""} ${r.middleName || ""} ${r.lastName || ""}`
//                               .replace(/\s+/g, " ")
//                               .trim()}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.phone || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.altPhone || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.sex || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.subCity || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.woreda || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.kebele || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.nearChurch || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.currentJob || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.graduatedField || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.houseType || "—"}
//                           </td>
//                           <td className="p-2 text-xs md:text-sm">
//                             {r.specificPlace || "—"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {group.rows.length > 0 && (
//                   <div className="flex justify-center items-center gap-4 mt-6">
//                     <button
//                       disabled={currentInnerPage === 1}
//                       onClick={() =>
//                         setGroupPage(group.organization, currentInnerPage - 1)
//                       }
//                       className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
//                     >
//                       Prev
//                     </button>

//                     <span className="font-semibold text-purple-700 text-sm">
//                       Page {currentInnerPage} / {totalInnerPages}
//                     </span>

//                     <button
//                       disabled={currentInnerPage === totalInnerPages}
//                       onClick={() =>
//                         setGroupPage(group.organization, currentInnerPage + 1)
//                       }
//                       className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {groupedByOrganizationList.length === 0 && (
//             <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
//               No organization grouped data found
//             </div>
//           )}

//           {groupedByOrganizationList.length > 0 && (
//             <div className="flex justify-center items-center gap-4 mt-6">
//               <button
//                 disabled={orgGroupPage === 1}
//                 onClick={() => setOrgGroupPage((p) => p - 1)}
//                 className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
//               >
//                 Prev
//               </button>

//               <span className="font-semibold text-purple-700 text-sm">
//                 Page {orgGroupPage} / {totalOrgGroupPages}
//               </span>

//               <button
//                 disabled={orgGroupPage === totalOrgGroupPages}
//                 onClick={() => setOrgGroupPage((p) => p + 1)}
//                 className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>

//         <MessageModal
//           open={modalOpen}
//           title={modalTitle}
//           message={modalMessage}
//           type={modalType}
//           onClose={() => setModalOpen(false)}
//         />
//       </main>
//     </div>
//   );
// }

// function DualMetricCard({
  title,
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
}) {
  return (
    <div className="min-w-0 w-full bg-white rounded-2xl shadow-lg p-1.5 sm:p-2 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition">
      <h3 className="text-[8px] sm:text-[9px] md:text-lg font-bold text-purple-700 mb-1 sm:mb-2 md:mb-4 leading-tight truncate">{title}</h3>
      <div className="space-y-2 md:space-y-4">
        <div className="rounded-xl bg-purple-50 p-2 md:p-3 min-w-0">
          <h2 className="text-sm sm:text-lg md:text-3xl font-bold text-purple-600 leading-tight truncate">{firstValue}</h2>
          <p className="text-[8px] sm:text-[9px] md:text-sm text-gray-600 mt-1 leading-tight truncate">{firstLabel}</p>
        </div>
        <div className="rounded-xl bg-green-50 p-2 md:p-3 min-w-0">
          <h2 className="text-sm sm:text-lg md:text-3xl font-bold text-green-600 leading-tight truncate">{secondValue}</h2>
          <p className="text-[8px] sm:text-[9px] md:text-sm text-gray-600 mt-1 leading-tight truncate">{secondLabel}</p>
        </div>
      </div>
    </div>
  );
}

function DualMetricCard({
  title,
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition">
      <h3 className="text-[10px] sm:text-xs md:text-lg font-bold text-purple-700 mb-3 md:mb-4 leading-tight">
        {title}
      </h3>

      <div className="space-y-4">
        <div className="rounded-xl bg-purple-50 p-3">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-600 leading-tight">
            {firstValue}
          </h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 leading-tight">
            {firstLabel}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-3">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-green-600 leading-tight">
            {secondValue}
          </h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 leading-tight">
            {secondLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniChartCard({ title, items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="min-w-0 w-full bg-white rounded-2xl shadow-lg p-1.5 sm:p-2 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition">
      <h3 className="text-[8px] sm:text-[9px] md:text-lg font-bold text-purple-700 mb-1 sm:mb-2 md:mb-4 leading-tight truncate">{title}</h3>
      <div className="space-y-1 sm:space-y-2 md:space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 text-[8px] md:text-sm truncate">No data</p>
        ) : (
          items.map((item) => (
            <div key={item.name} className="min-w-0">
              <div className="flex justify-between text-[8px] sm:text-[9px] md:text-sm mb-1 gap-1">
                <span className="text-gray-700 truncate min-w-0">{item.name}</span>
                <span className="font-semibold text-purple-700 shrink-0">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 md:h-2 overflow-hidden">
                <div className="bg-purple-500 h-1 md:h-2 rounded-full" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
