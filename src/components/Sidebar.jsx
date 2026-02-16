import { useState } from "react";

export default function Sidebar({ admin }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden flex items-center justify-between
      bg-purple-500 text-white p-4 h-screen"
      >
        <h1 className="text-xl font-semibold">
          {admin ? "Admin Dashboard" : "Dashboard"}
        </h1>

        <button onClick={() => setOpen(!open)} className="text-3xl">
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static z-50
        top-0 left-0 h-full w-72
        bg-purple-300 p-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        rounded-r-[40px] shadow-lg
      `}
      >
        <h2 className="text-white text-3xl mb-10">
          {admin ? "Admin Dashboard" : "Dashboard"}
        </h2>

        <ul className="space-y-6 text-lg">
          <li className="cursor-pointer hover:text-white">Dashboard</li>

          {admin && <li className="cursor-pointer hover:text-white">Users</li>}

          <li className="cursor-pointer hover:text-white">Report</li>
          <li className="cursor-pointer hover:text-white">History Log</li>

          {admin && (
            <li className="mt-10 font-bold cursor-pointer hover:text-white">
              Logout
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
