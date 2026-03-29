import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import MessageModal from "../components/MessageModal";
// import TokenExpireIn from ".."

export default function AdminQuestionnaire() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    bySubCity: [],
    bySex: [],
    byHouseType: [],
    topOrganizations: [],
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [subCityFilter, setSubCityFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(1);
  const perPage = 10;

  // grouped by sub-city block pagination
  const [subCityGroupPage, setSubCityGroupPage] = useState(1);
  const subCityGroupsPerPage = 5;

  // inner row pagination for each grouped-by-sub-city block
  const [subCityRowPages, setSubCityRowPages] = useState({});
  const subCityRowsPerPage = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const showModal = (title, message, type = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [navigate]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const loadRows = async () => {
    try {
      const res = await api.get("/questionnaire");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.rows || res.data?.questionnaires || [];
      setRows(data);
    } catch (err) {
      console.error(
        "Questionnaire load error:",
        err.response?.data || err.message,
      );
      setRows([]);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/questionnaire/analytics/summary");
      setAnalytics(
        res.data || {
          total: 0,
          bySubCity: [],
          bySex: [],
          byHouseType: [],
          topOrganizations: [],
        },
      );
    } catch (err) {
      console.error(
        "Questionnaire analytics error:",
        err.response?.data || err.message,
      );
    }
  };

  const refreshAll = async () => {
    await Promise.all([loadRows(), loadAnalytics()]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const subCities = useMemo(() => {
    const set = new Set(rows.map((r) => r.subCity).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      const subCityOk =
        subCityFilter === "All" ? true : r.subCity === subCityFilter;

      if (!q) return subCityOk;

      const hay = [
        r.firstName,
        r.middleName,
        r.lastName,
        r.phone,
        r.altPhone,
        r.organization,
        r.subCity,
        r.woreda,
        r.nearChurch,
        r.currentJob,
        r.graduatedField,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return subCityOk && hay.includes(q);
    });
  }, [rows, search, subCityFilter]);

  const grouped = useMemo(() => {
    return filteredRows.reduce((acc, item) => {
      const key = `${item.subCity || "N/A"}__${item.woreda || "N/A"}__${item.nearChurch || "N/A"}`;
      if (!acc[key]) {
        acc[key] = {
          subCity: item.subCity || "N/A",
          woreda: item.woreda || "N/A",
          nearChurch: item.nearChurch || "N/A",
          rows: [],
        };
      }
      acc[key].rows.push(item);
      return acc;
    }, {});
  }, [filteredRows]);

  const groupedList = useMemo(() => Object.values(grouped), [grouped]);

  const groupedBySubCityOnly = useMemo(() => {
    return filteredRows.reduce((acc, item) => {
      const key = item.subCity || "N/A";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredRows]);

  const groupedBySubCityList = useMemo(
    () =>
      Object.entries(groupedBySubCityOnly).map(([subCity, dataRows]) => ({
        subCity,
        rows: dataRows,
      })),
    [groupedBySubCityOnly],
  );

  const totalPages = Math.ceil(filteredRows.length / perPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page]);

  // reset grouped sub-city outer page when data/filter/search changes
  useEffect(() => {
    setSubCityGroupPage(1);
    setSubCityRowPages({});
  }, [search, subCityFilter, rows]);

  const totalSubCityGroupPages =
    Math.ceil(groupedBySubCityList.length / subCityGroupsPerPage) || 1;

  useEffect(() => {
    if (subCityGroupPage > totalSubCityGroupPages) {
      setSubCityGroupPage(totalSubCityGroupPages);
    }
  }, [subCityGroupPage, totalSubCityGroupPages]);

  const paginatedSubCityGroups = useMemo(() => {
    const start = (subCityGroupPage - 1) * subCityGroupsPerPage;
    return groupedBySubCityList.slice(start, start + subCityGroupsPerPage);
  }, [groupedBySubCityList, subCityGroupPage]);

  const getSubCityRowPage = (subCity) => subCityRowPages[subCity] || 1;

  const setSubCityRowPage = (subCity, nextPage) => {
    setSubCityRowPages((prev) => ({
      ...prev,
      [subCity]: nextPage,
    }));
  };

  const getSubCityRowTotalPages = (group) =>
    Math.ceil(group.rows.length / subCityRowsPerPage) || 1;

  const getPaginatedSubCityRows = (group) => {
    const currentPage = getSubCityRowPage(group.subCity);
    const start = (currentPage - 1) * subCityRowsPerPage;
    return group.rows.slice(start, start + subCityRowsPerPage);
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setEditForm({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/questionnaire/${id}`, editForm);
      const updated = res.data?.data || editForm;

      setRows((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item)),
      );

      cancelEdit();
      await loadAnalytics();
      showModal("Success", "Changes saved successfully", "success");
    } catch (err) {
      console.error(
        "Questionnaire edit error:",
        err.response?.data || err.message,
      );
      showModal(
        "Error",
        "Failed to save changes, token expired, or no internet connection",
        "error",
      );
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete this questionnaire record?")) return;

    try {
      await api.delete(`/questionnaire/${id}`);
      setRows((prev) => prev.filter((item) => item._id !== id));
      await loadAnalytics();
      showModal("Success", "Deleted successfully", "success");
    } catch (err) {
      console.error(
        "Questionnaire delete error:",
        err.response?.data || err.message,
      );
      showModal(
        "Error",
        "Failed to delete, token expired, or no internet connection",
        "error",
      );
    }
  };

  const downloadBlob = (data, fileName, mimeType) => {
    const blob = new Blob([data], mimeType ? { type: mimeType } : undefined);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportAllExcel = async () => {
    try {
      const res = await api.get("/questionnaire/export/excel/all", {
        responseType: "blob",
      });
      downloadBlob(
        res.data,
        "questionnaires-all.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      showModal("Success", "All data exported successfully", "success");
    } catch (err) {
      console.error("Export all error:", err.response?.data || err.message);
      showModal(
        "Error",
        "Failed to export all, token expired, or no internet connection",
        "error",
      );
    }
  };

  const exportBySubCityExcel = async () => {
    try {
      const res = await api.get("/questionnaire/export/excel/by-subcity", {
        responseType: "blob",
      });

      downloadBlob(
        res.data,
        "questionnaires-by-subcity.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      showModal("Success", "Sub-city export completed", "success");
    } catch (err) {
      let msg =
        "Failed to export by sub-city, token expired, or no internet connection";
      try {
        if (err.response?.data) {
          msg = await err.response.data.text();
        }
      } catch {}
      console.error("Export subcity error:", msg);
      showModal(
        "Export Error, token expired, or no internet connection",
        msg,
        "error",
      );
    }
  };

  const exportGroupExcel = async (group) => {
    try {
      const params = new URLSearchParams({
        subCity: group.subCity || "",
        woreda: group.woreda || "",
        nearChurch: group.nearChurch || "",
      });

      const res = await api.get(
        `/questionnaire/export/excel/group?${params.toString()}`,
        { responseType: "blob" },
      );

      downloadBlob(
        res.data,
        "questionnaire-group.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      showModal("Success", "Group Excel exported successfully", "success");
    } catch (err) {
      let msg = "Failed to export group, ";
      try {
        if (err.response?.data) {
          msg = await err.response.data.text();
        }
      } catch {}
      console.error("Export group error:", msg);
      showModal(
        "Export Error, token expired, or no internet connection",
        msg,
        "error",
      );
    }
  };

  const exportGroupPDF = async (group) => {
    try {
      const params = new URLSearchParams({
        subCity: group.subCity || "",
        woreda: group.woreda || "",
        nearChurch: group.nearChurch || "",
      });

      const res = await api.get(
        `/questionnaire/export/pdf/group?${params.toString()}`,
        { responseType: "blob" },
      );

      downloadBlob(res.data, "questionnaire-group.pdf", "application/pdf");
      showModal("Success", "Group PDF exported successfully", "success");
    } catch (err) {
      let msg = "Failed to export PDF";
      try {
        if (err.response?.data) {
          msg = await err.response.data.text();
        }
      } catch {}
      console.error("PDF export error:", msg);
      showModal(
        "PDF Export Error, token expired, or no internet connection",
        msg,
        "error",
      );
    }
  };

  const addMasterItem = async (type, label) => {
    const value = window.prompt(`Add ${label}`);
    if (!value || !value.trim()) return;

    try {
      await api.post("/options", {
        type,
        value: value.trim(),
      });
      showModal("Success", `${label} added successfully`, "success");
    } catch (err) {
      const msg =
        err.response?.data?.message || `Failed to add ${label.toLowerCase()}`;
      showModal("Error", msg, "error");
    }
  };

  const menu = [
    // { id: "dashboard", label: "Travel Overview", path: "/admin-dashboard" },
    // { id: "report", label: "Travel Report", path: "/admin-report" },
    {
      id: "questionnaire",
      label: "Questionnaire Data",
      path: "/admin-questionnaire",
    },
    {
      id: "questionnaire-view-dashboard",
      label: "Questionnaire View Org",
      path: "/questionnaire-view-dashboard",
    },
    { id: "history", label: " History Log", path: "/admin-history" },
    { id: "logout", label: "LOGOUT", action: "logout" },
  ];

  const handleMenu = (item) => {
    setSidebarOpen(false);
    if (item.action === "logout") {
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
      return;
    }
    if (item.path) navigate(item.path);
  };

  return (
    <div className="flex min-h-screen bg-gray-200 min-w-fit">
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

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-40 h-full md:h-auto w-64 bg-purple-400 text-white pt-16 md:pt-6 p-6 shadow-xl
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

        <ul className="space-y-4">
          {menu.map((item) => (
            <li
              key={item.id}
              onClick={() => handleMenu(item)}
              className={`cursor-pointer p-3 rounded-xl transition-all duration-300 ${
                item.id === "questionnaire"
                  ? "bg-white text-purple-600 font-bold shadow"
                  : "hover:bg-white/20 hover:backdrop-blur hover:scale-105 hover:shadow-lg"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-3 sm:p-4 md:p-8 pt-16 md:pt-8 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
              Questionnaire Management
            </h1>
          </div>

          <br />
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
          Quick Overview
        </h1>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4"></div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4">
          <MetricCard
            className="text-2xl content-center items-center"
            label="Total Records"
            value={analytics.total || 0}
          />
          <MiniChartCard title="By Sex" items={analytics.bySex || []} />
          <MiniChartCard
            title="By House Type"
            items={analytics.byHouseType || []}
          />
          <MiniChartCard
            title="Top Sub Cities"
            items={(analytics.bySubCity || []).slice(0, 5)}
          />
        </div>

        <div>
          <h1 className="text-xl md:text-4xl font-semibold text-purple-600">
            Actions Center
          </h1>
        </div>
        <br />

        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={exportAllExcel}
            className="bg-purple-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-purple-700 hover:scale-105 hover:shadow-lg transition text-xs md:text-sm"
          >
            Export All Excel
          </button>

          <button
            onClick={exportBySubCityExcel}
            className="bg-green-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-green-700 hover:scale-105 hover:shadow-lg transition text-xs md:text-sm"
          >
            Export By Sub-City
          </button>

          <button
            onClick={() => navigate("/admin-questionnaire-print")}
            className="bg-blue-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition text-xs md:text-sm"
          >
            Print Summary
          </button>

          <button
            onClick={refreshAll}
            className="bg-white text-purple-700 px-3 md:px-5 py-2 rounded-full shadow font-semibold hover:shadow-xl hover:-translate-y-[1px] transition text-xs md:text-sm"
          >
            Refresh
          </button>
        </div>

        <br />

        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          <button
            onClick={async () => {
              try {
                const res = await api.get(
                  "/questionnaire/export/excel/by-subcity-one-sheet",
                  {
                    responseType: "blob",
                  },
                );
                const blob = new Blob([res.data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "questionnaires-by-subcity-one-sheet.xlsx";
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                console.error(err);
              }
            }}
            className="bg-emerald-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-emerald-700 hover:scale-105 transition text-xs md:text-sm"
          >
            Export By Sub-City Excel in 1 sheet
          </button>

          <button
            onClick={async () => {
              try {
                const res = await api.get(
                  "/questionnaire/export/pdf/by-subcity",
                  {
                    responseType: "blob",
                  },
                );
                const blob = new Blob([res.data], {
                  type: "application/pdf",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "questionnaires-by-subcity.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                console.error(err);
              }
            }}
            className="bg-rose-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-rose-700 hover:scale-105 transition text-xs md:text-sm"
          >
            Export By Sub-City PDF
          </button>

          <button
            onClick={() => navigate("/questionnaire-view-dashboard")}
            className="bg-purple-700 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-purple-800 hover:scale-105 transition text-xs md:text-sm"
          >
            View Organiztion
          </button>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
          <button
            onClick={() => addMasterItem("organization", "Organization")}
            className="bg-purple-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-purple-700 hover:scale-105 transition text-xs md:text-sm"
          >
            Add Organization
          </button>

          <button
            onClick={() => addMasterItem("subCity", "Sub City")}
            className="bg-green-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-green-700 hover:scale-105 transition text-xs md:text-sm"
          >
            Add Sub City
          </button>

          <button
            onClick={() => addMasterItem("currentJob", "Job")}
            className="bg-blue-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-blue-700 hover:scale-105 transition text-xs md:text-sm"
          >
            Add Job
          </button>

          <button
            onClick={() => addMasterItem("graduatedField", "Graduation Field")}
            className="bg-orange-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-orange-700 hover:scale-105 transition text-xs md:text-sm"
          >
            Add Graduation Field
          </button>
        </div>

        <hr />
        <br />

        <div className="bg-white rounded-2xl shadow p-3 md:p-4 mb-8 hover:shadow-2xl hover:-translate-y-1 transition">
          <h2 className="text-sm md:text-lg font-bold text-purple-700 mb-4">
            Top Organizations
          </h2>
          <MiniBarList items={analytics.topOrganizations || []} />
        </div>

        <h1 className="text-lg md:text-4xl font-bold text-purple-600">
          Table showing the most ten recently submitted data
        </h1>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name / phone / org / sub-city / church..."
            className="w-full md:w-[420px] bg-white rounded-full px-4 md:px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />

          <select
            value={subCityFilter}
            onChange={(e) => {
              setSubCityFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white rounded-full px-4 md:px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          >
            {subCities.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Sub Cities" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="w-full table-fixed bg-white rounded-xl shadow">
            <thead className="bg-purple-400 text-white">
              <tr>
                <th className="p-2 text-xs md:text-sm">Questionnaire ID</th>
                <th className="p-2 text-xs md:text-sm">Full Name</th>
                <th className="p-2 text-xs md:text-sm">Phone</th>
                <th className="p-2 text-xs md:text-sm">Organization</th>
                <th className="p-2 text-xs md:text-sm">Sub City</th>
                <th className="p-2 text-xs md:text-sm">Woreda</th>
                <th className="p-2 text-xs md:text-sm">Near Church</th>
                <th className="p-2 text-xs md:text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-6 text-center text-gray-500 text-sm"
                  >
                    No questionnaire data found
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item._id}
                    className="text-center border-b hover:bg-purple-50 transition hover:shadow-md"
                  >
                    <td className="p-2 text-xs md:text-sm font-semibold text-purple-700">
                      {item.questionnaireId || "—"}
                    </td>

                    <td className="p-2 text-xs md:text-sm">
                      {editingId === item._id ? (
                        <div className="grid gap-2">
                          <input
                            value={editForm.firstName || ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                firstName: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded text-xs md:text-sm"
                          />
                          <input
                            value={editForm.middleName || ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                middleName: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded text-xs md:text-sm"
                          />
                          <input
                            value={editForm.lastName || ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                lastName: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded text-xs md:text-sm"
                          />
                        </div>
                      ) : (
                        `${item.firstName || ""} ${item.middleName || ""} ${item.lastName || ""}`.trim()
                      )}
                    </td>

                    <td className="p-2 text-xs md:text-sm">
                      {editingId === item._id ? (
                        <input
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded text-xs md:text-sm"
                        />
                      ) : (
                        item.phone || "—"
                      )}
                    </td>

                    <td className="p-2 text-xs md:text-sm">
                      {editingId === item._id ? (
                        <input
                          value={editForm.organization || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              organization: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded text-xs md:text-sm"
                        />
                      ) : (
                        item.organization || "—"
                      )}
                    </td>

                    <td className="p-2 text-xs md:text-sm">
                      {editingId === item._id ? (
                        <input
                          value={editForm.subCity || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              subCity: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded text-xs md:text-sm"
                        />
                      ) : (
                        item.subCity || "—"
                      )}
                    </td>

                    <td className="p-2 text-xs md:text-sm">
                      {editingId === item._id ? (
                        <input
                          value={editForm.woreda || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              woreda: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded text-xs md:text-sm"
                        />
                      ) : (
                        item.woreda || "—"
                      )}
                    </td>

                    <td className="p-2 text-xs md:text-sm">
                      {editingId === item._id ? (
                        <input
                          value={editForm.nearChurch || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              nearChurch: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded text-xs md:text-sm"
                        />
                      ) : (
                        item.nearChurch || "—"
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === item._id ? (
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => saveEdit(item._id)}
                            className="bg-purple-600 text-white px-2 md:px-3 py-1 rounded hover:scale-105 transition text-xs md:text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-2 md:px-3 py-1 rounded hover:scale-105 transition text-xs md:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded hover:scale-105 transition text-xs md:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRow(item._id)}
                            className="bg-red-600 text-white px-2 md:px-3 py-1 rounded hover:scale-105 transition text-xs md:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filteredRows.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
              >
                Prev
              </button>

              <span className="font-semibold text-purple-700 text-sm">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h1 className="text-lg md:text-4xl font-bold text-purple-600">
              Grouped by Sub City
            </h1>
            <div></div>
          </div>

          {paginatedSubCityGroups.map((group) => {
            const currentInnerPage = getSubCityRowPage(group.subCity);
            const totalInnerPages = getSubCityRowTotalPages(group);
            const visibleRows = getPaginatedSubCityRows(group);

            return (
              <div
                key={group.subCity}
                className="bg-white rounded-2xl shadow p-3 md:p-4 hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <div className="mb-4">
                  <h2 className="text-base md:text-xl font-bold text-purple-700">
                    {group.subCity}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Total Records: {group.rows.length}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed bg-white rounded-xl border">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="p-2 text-xs md:text-sm">
                          Questionnaire ID
                        </th>
                        <th className="p-2 text-xs md:text-sm">Full Name</th>
                        <th className="p-2 text-xs md:text-sm">Phone</th>
                        <th className="p-2 text-xs md:text-sm">Organization</th>
                        <th className="p-2 text-xs md:text-sm">Current Job</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((r) => (
                        <tr
                          key={r._id}
                          className="text-center border-b hover:bg-purple-50 transition"
                        >
                          <td className="p-2 text-xs md:text-sm font-semibold text-purple-700">
                            {r.questionnaireId || "—"}
                          </td>
                          <td className="p-2 text-xs md:text-sm">
                            {`${r.firstName || ""} ${r.middleName || ""} ${r.lastName || ""}`.trim()}
                          </td>
                          <td className="p-2 text-xs md:text-sm">
                            {r.phone || "—"}
                          </td>
                          <td className="p-2 text-xs md:text-sm">
                            {r.organization || "—"}
                          </td>
                          <td className="p-2 text-xs md:text-sm">
                            {r.currentJob || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {group.rows.length > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      disabled={currentInnerPage === 1}
                      onClick={() =>
                        setSubCityRowPage(group.subCity, currentInnerPage - 1)
                      }
                      className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
                    >
                      Prev
                    </button>

                    <span className="font-semibold text-purple-700 text-sm">
                      Page {currentInnerPage} / {totalInnerPages}
                    </span>

                    <button
                      disabled={currentInnerPage === totalInnerPages}
                      onClick={() =>
                        setSubCityRowPage(group.subCity, currentInnerPage + 1)
                      }
                      className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {groupedBySubCityList.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
              No sub-city grouped data found
            </div>
          )}

          {groupedBySubCityList.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={subCityGroupPage === 1}
                onClick={() => setSubCityGroupPage((p) => p - 1)}
                className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
              >
                Prev
              </button>

              <span className="font-semibold text-purple-700 text-sm">
                Page {subCityGroupPage} / {totalSubCityGroupPages}
              </span>

              <button
                disabled={subCityGroupPage === totalSubCityGroupPages}
                onClick={() => setSubCityGroupPage((p) => p + 1)}
                className="bg-purple-600 text-white px-4 md:px-6 py-2 rounded-full shadow disabled:opacity-40 text-xs md:text-sm hover:bg-purple-700 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <h1 className="text-lg md:text-4xl font-bold text-purple-600">
          Grouped by Sub-City, Woreda and Near-Church data lists
        </h1>

        <div className="space-y-6 md:space-y-8">
          {groupedList.map((group, idx) => (
            <div
              key={`${group.subCity}-${group.woreda}-${group.nearChurch}-${idx}`}
              className="bg-white rounded-2xl shadow p-3 md:p-4 hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base md:text-xl font-bold text-purple-700">
                    {group.subCity}
                  </h2>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Woreda: {group.woreda} | Near Church: {group.nearChurch}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    Total Records: {group.rows.length}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button
                    onClick={() => exportGroupExcel(group)}
                    className="bg-green-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-green-700 hover:scale-105 transition text-xs md:text-sm"
                  >
                    Export Excel
                  </button>

                  <button
                    onClick={() => exportGroupPDF(group)}
                    className="bg-red-600 text-white px-3 md:px-5 py-2 rounded-full shadow hover:bg-red-700 hover:scale-105 transition text-xs md:text-sm"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-fixed bg-white rounded-xl border">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-2 text-xs md:text-sm">
                        Questionnaire ID
                      </th>
                      <th className="p-2 text-xs md:text-sm">Full Name</th>
                      <th className="p-2 text-xs md:text-sm">Phone</th>
                      <th className="p-2 text-xs md:text-sm">Organization</th>
                      <th className="p-2 text-xs md:text-sm">Current Job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((r) => (
                      <tr
                        key={r._id}
                        className="text-center border-b hover:bg-purple-50 transition"
                      >
                        <td className="p-2 text-xs md:text-sm font-semibold text-purple-700">
                          {r.questionnaireId || "—"}
                        </td>
                        <td className="p-2 text-xs md:text-sm">
                          {`${r.firstName || ""} ${r.middleName || ""} ${r.lastName || ""}`.trim()}
                        </td>
                        <td className="p-2 text-xs md:text-sm">
                          {r.phone || "—"}
                        </td>
                        <td className="p-2 text-xs md:text-sm">
                          {r.organization || "—"}
                        </td>
                        <td className="p-2 text-xs md:text-sm">
                          {r.currentJob || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {groupedList.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
              No grouped data found
            </div>
          )}
        </div>

        <MessageModal
          open={modalOpen}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalOpen(false)}
        />
      </main>
    </div>
  );
}

function MetricCard({ label, value, className = "" }) {
  return (
    <div
      className={`min-w-0 w-full bg-white rounded-2xl shadow-lg p-2 sm:p-3 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition ${className}`}
    >
      <p className="text-[9px] sm:text-[10px] md:text-sm text-gray-500 mb-1 truncate">
        {label}
      </p>
      <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-purple-600 leading-tight truncate">
        {value}
      </h2>
    </div>
  );
}

// function MetricCard({ label, value, className = "" }) {
//   return (
//     <div
//       className={`bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition ${className}`}
//     >
//       <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-1 md:mb-2">
//         {label}
//       </p>
//       <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-600 leading-tight">
//         {value}
//       </h2>
//     </div>
//   );
// }

function MiniChartCard({ title, items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="min-w-0 w-full bg-white rounded-2xl shadow-lg p-2 sm:p-3 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition">
      <h3 className="text-[9px] sm:text-[10px] md:text-lg font-bold text-purple-700 mb-2 md:mb-4 leading-tight truncate">
        {title}
      </h3>
      <div className="space-y-2 md:space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 text-[9px] md:text-sm">No data</p>
        ) : (
          items.slice(0, 3).map((item) => (
            <div key={item.name} className="min-w-0">
              <div className="flex justify-between text-[9px] md:text-sm mb-1 gap-2">
                <span className="text-gray-700 truncate min-w-0">
                  {item.name}
                </span>
                <span className="font-semibold text-purple-700 shrink-0">
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-1.5 md:h-2 rounded-full"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MiniBarList({ items }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-2 md:space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No data</p>
      ) : (
        items.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-xs md:text-sm mb-1 gap-2">
              <span className="text-gray-700 truncate">{item.name}</span>
              <span className="font-semibold text-purple-700 shrink-0">
                {item.count}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="bg-green-500 h-2 md:h-3 rounded-full"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
