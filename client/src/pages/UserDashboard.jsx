import Sidebar from "../components/admin/Sidebar";

export default function UserDashboard() {
  return (
    // <div className="flex bg-[#d1d5db] min-h-screen">
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />
      {/* Sidebar */}
      {/* <div
        className="w-72 bg-gradient-to-b from-purple-400 to-purple-500
      rounded-r-[45px] p-8 text-white shadow-xl"
      >
        <h2 className="text-4xl font-semibold mb-12">Dashboard</h2>

        <ul className="space-y-8 text-xl">
          <li>Payment statuses</li>
          <li>Report</li>
          <li>History Log</li>
        </ul>
      </div> */}

      {/* Main Content */}
      {/* <div className="flex-1 p-10"> */}
      <div className="flex-1 p-6 md:p-10">
        {/* Title */}
        <div
          className="bg-gradient-to-r from-purple-400 to-purple-500
        rounded-[40px] py-8 text-center text-white
        text-5xl mb-16 shadow-lg"
        >
          Fill all required info
        </div>

        {/* Form Card */}
        <div
          className="bg-gradient-to-b from-purple-300 to-purple-200
        rounded-[40px] max-w-2xl mx-auto p-12 shadow-lg"
        >
          <form className="space-y-7">
            {[
              "First Name",
              "Middle Name",
              "Last Name",
              "Sex",
              "Address",
              "Phone Number",
            ].map((field) => (
              <input
                key={field}
                placeholder={field}
                className="w-full p-4 rounded-xl
                bg-white/90 shadow outline-none"
              />
            ))}

            <input type="file" className="mt-4" />

            <div className="text-center">
              <button
                className="bg-white text-purple-600
                px-10 py-3 rounded-xl font-bold
                shadow hover:scale-105 transition"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
