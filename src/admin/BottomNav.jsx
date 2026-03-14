import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="bg-white shadow-lg flex justify-around py-3">
      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/bookings">Bookings</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
    </div>
  );
}
