import { useEffect, useState } from "react";
import api from "../services/api";

export default function Header() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/unread-count");
        setCount(res.data.count);
      } catch {
        setCount(0);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="relative">
        🔔
        {count > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-500 
          text-white text-xs rounded-full px-2"
          >
            {count}
          </span>
        )}
      </div>
    </header>
  );
}
