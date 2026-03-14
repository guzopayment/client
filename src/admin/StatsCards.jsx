import { useEffect, useState } from "react";
import api from "../services/api";

export default function StatsCards() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white shadow rounded-xl p-6">
        <h3>Total Bookings</h3>
        <p className="text-3xl font-bold">{stats.totalBookings || 0}</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3>Total Users</h3>
        <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
      </div>
    </div>
  );
}
