import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
      setAnalytics({
        total: 0,
        bySubCity: [],
        bySex: [],
        byHouseType: [],
        topOrganizations: [],
      });
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

  const totalPages = Math.ceil(filteredRows.length / perPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page]);

  const startEdit = (row) => {
    setEditingId(row._id);
    setEditForm({
      firstName: row.firstName || "",
      middleName: row.middleName || "",
      lastName: row.lastName || "",
      phone: row.phone || "",
      altPhone: row.altPhone || "",
      organization: row.organization || "",
      sex: row.sex || "",
      graduatedField: row.graduatedField || "",
      currentJob: row.currentJob || "",
      subCity: row.subCity || "",
      woreda: row.woreda || "",
      kebele: row.kebele || "",
      specificPlace: row.specificPlace || "",
      nearChurch: row.nearChurch || "",
      houseType: row.houseType || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/questionnaire/${id}`, editForm);
      const updated = res.data?.data || res.data?.questionnaire || editForm;

      setRows((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item)),
      );

      cancelEdit();
      await loadAnalytics();
    } catch (err) {
      console.error(
        "Questionnaire edit error:",
        err.response?.data || err.message,
      );
      alert(err.response?.data?.message || "Failed to save changes");
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete this questionnaire record?")) return;

    try {
      await api.delete(`/questionnaire/${id}`);
      setRows((prev) => prev.filter((item) => item._id !== id));
      await loadAnalytics();
    } catch (err) {
      console.error(
        "Questionnaire delete error:",
        err.response?.data || err.message,
      );
      alert(err.response?.data?.message || "Failed to delete");
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
    } catch (err) {
      console.error("Export all error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to export all");
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
    } catch (err) {
      console.error("Export subcity error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Failed to export sub-city workbook",
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
        `${group.subCity}-${group.woreda}-${group.nearChurch}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
    } catch (err) {
      console.error("Export group error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to export group");
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

      downloadBlob(
        res.data,
        `${group.subCity}-${group.woreda}-${group.nearChurch}.pdf`,
        "application/pdf",
      );
    } catch (err) {
      console.error("PDF export error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to export PDF");
    }
  };

  const menu = [
    { id: "dashboard", label: "Dashboard Overview", path: "/admin-dashboard" },
    { id: "report", label: "Report", path: "/admin-report" },
    { id: "history", label: "History Log", path: "/admin-history" },
    {
      id: "questionnaire",
      label: "Questionnaire",
      path: "/admin-questionnaire",
    },
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

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600">
            Questionnaire Management
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportAllExcel}
              className="bg-purple-600 text-white px-5 py-2 rounded-full shadow"
            >
              Export All Excel
            </button>

            <button
              onClick={exportBySubCityExcel}
              className="bg-green-600 text-white px-5 py-2 rounded-full shadow"
            >
              Export By Sub-City
            </button>

            <button
              onClick={() => navigate("/admin-questionnaire-print")}
              className="bg-blue-600 text-white px-5 py-2 rounded-full shadow"
            >
              Print Summary
            </button>

            <button
              onClick={refreshAll}
              className="bg-white text-purple-700 px-5 py-2 rounded-full shadow font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Records" value={analytics.total || 0} />
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

        <div className="bg-white rounded-2xl shadow p-4 mb-8">
          <h2 className="text-lg font-bold text-purple-700 mb-4">
            Top Organizations
          </h2>
          <MiniBarList items={analytics.topOrganizations || []} />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name / phone / org / sub-city / church..."
            className="w-full md:w-[420px] bg-white rounded-full px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <select
            value={subCityFilter}
            onChange={(e) => {
              setSubCityFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white rounded-full px-5 py-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {subCities.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Sub Cities" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-purple-400 text-white">
              <tr>
                <th className="p-2">Full Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Organization</th>
                <th className="p-2">Sub City</th>
                <th className="p-2">Woreda</th>
                <th className="p-2">Near Church</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No questionnaire data found
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item._id}
                    className="text-center border-b hover:bg-purple-50 transition"
                  >
                    <td className="p-2">
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
                            className="border px-2 py-1 rounded"
                          />
                          <input
                            value={editForm.middleName || ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                middleName: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded"
                          />
                          <input
                            value={editForm.lastName || ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                lastName: e.target.value,
                              }))
                            }
                            className="border px-2 py-1 rounded"
                          />
                        </div>
                      ) : (
                        `${item.firstName || ""} ${item.middleName || ""} ${item.lastName || ""}`.trim()
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === item._id ? (
                        <input
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        item.phone || "—"
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === item._id ? (
                        <input
                          value={editForm.organization || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              organization: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        item.organization || "—"
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === item._id ? (
                        <input
                          value={editForm.subCity || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              subCity: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        item.subCity || "—"
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === item._id ? (
                        <input
                          value={editForm.woreda || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              woreda: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        item.woreda || "—"
                      )}
                    </td>

                    <td className="p-2">
                      {editingId === item._id ? (
                        <input
                          value={editForm.nearChurch || ""}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              nearChurch: e.target.value,
                            }))
                          }
                          className="border px-2 py-1 rounded"
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
                            className="bg-purple-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRow(item._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
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
                className="bg-purple-600 text-white px-6 py-2 rounded-full shadow disabled:opacity-40"
              >
                Prev
              </button>

              <span className="font-semibold text-purple-700">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-purple-600 text-white px-6 py-2 rounded-full shadow disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {groupedList.map((group, idx) => (
            <div
              key={`${group.subCity}-${group.woreda}-${group.nearChurch}-${idx}`}
              className="bg-white rounded-2xl shadow p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-purple-700">
                    {group.subCity}
                  </h2>
                  <p className="text-gray-600">
                    Woreda: {group.woreda} | Near Church: {group.nearChurch}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Records: {group.rows.length}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => exportGroupExcel(group)}
                    className="bg-green-600 text-white px-5 py-2 rounded-full shadow"
                  >
                    Export Excel
                  </button>

                  <button
                    onClick={() => exportGroupPDF(group)}
                    className="bg-red-600 text-white px-5 py-2 rounded-full shadow"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl border">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-2">Full Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Organization</th>
                      <th className="p-2">Current Job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((r) => (
                      <tr key={r._id} className="text-center border-b">
                        <td className="p-2">
                          {`${r.firstName || ""} ${r.middleName || ""} ${r.lastName || ""}`.trim()}
                        </td>
                        <td className="p-2">{r.phone || "—"}</td>
                        <td className="p-2">{r.organization || "—"}</td>
                        <td className="p-2">{r.currentJob || "—"}</td>
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
      </main>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 text-center hover:shadow-2xl hover:-translate-y-1 transition">
      <h2 className="text-3xl font-bold text-purple-600">{value}</h2>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}

function MiniChartCard({ title, items }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:-translate-y-1 transition">
      <h3 className="text-lg font-bold text-purple-700 mb-4">{title}</h3>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No data</p>
        ) : (
          items.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-semibold text-purple-700">
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-2 rounded-full"
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
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No data</p>
      ) : (
        items.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{item.name}</span>
              <span className="font-semibold text-purple-700">
                {item.count}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
