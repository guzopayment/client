import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-purple-600 text-white h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="space-y-4">
        <NavLink to="/admin" className="block">
          Dashboard
        </NavLink>

        <NavLink to="/admin/bookings" className="block">
          Bookings
        </NavLink>

        <NavLink to="/admin/users" className="block">
          Users
        </NavLink>
      </nav>
    </div>
  );
}
