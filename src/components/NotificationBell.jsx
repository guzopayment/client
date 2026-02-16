import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../socket";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/notifications").then((res) => setNotifications(res.data));

    socket.on("notification", (n) => {
      setNotifications((prev) => [n, ...prev]);
    });
  }, []);

  useEffect(() => {
    fetchCount();
    fetchNotifications();

    socket.on("newNotification", (data) => {
      setCount((c) => c + 1);
      setList((prev) => [data, ...prev]);
    });

    return () => socket.off("newNotification");
  }, []);

  const fetchCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setCount(res.data.count);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setList(res.data);
  };

  const markRead = async (id) => {
    await api.put(`/notifications/mark-read/${id}`);
    setCount((c) => (c > 0 ? c - 1 : 0));
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <div className="relative">
          🔔
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}
        </div>

        {/* 🔔 {count > 0 && <span>{count}</span>} */}
      </button>

      {open && (
        <div className="absolute right-0 bg-white shadow p-7 w-72">
          {list.map((n) => (
            <div
              key={n._id}
              className="border-b py-2 cursor-pointer"
              onClick={() => markRead(n._id)}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
