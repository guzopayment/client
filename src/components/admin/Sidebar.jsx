import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden bg-purple-600 text-white p-4
      flex justify-between items-center"
      >
        <h1 className="font-semibold">Admin</h1>

        <button onClick={() => setOpen(!open)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static z-50 top-0 left-0 h-full w-64
        bg-purple-500 text-white p-6
        transform transition duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <h2 className="text-3xl mb-10 font-bold">Dashboard</h2>

        <ul className="space-y-6 text-lg">
          <li className="hover:text-gray-200 cursor-pointer">Dashboard</li>
          <li className="hover:text-gray-200 cursor-pointer">Users</li>
          <li className="hover:text-gray-200 cursor-pointer">Reports</li>
          <li className="hover:text-gray-200 cursor-pointer">Payments</li>
          <li className="hover:text-gray-200 cursor-pointer">Settings</li>
          <li className="mt-10 font-bold cursor-pointer">Logout</li>
        </ul>
      </aside>
    </>
  );
}
