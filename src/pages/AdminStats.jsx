import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow p-6 rounded">
          <h3>Total Participants</h3>
          <p className="text-2xl font-bold">{stats.totalParticipants}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h3>Total Bookings</h3>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
      </div>

      {/* Organization Breakdown */}
      <h2 className="text-xl mb-4 font-semibold">
        Participants by Organization
      </h2>

      <div className="space-y-2">
        {Object.entries(stats.organizations).map(([org, val]) => (
          <div
            key={org}
            className="bg-gray-100 p-3 rounded flex justify-between"
          >
            <span>{org}</span>
            <strong>{val}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
