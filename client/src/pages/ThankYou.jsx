export default function ThankYou() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-extrabold mb-6 bg-purple-900 text-white py-3 rounded">
          Thank You!
        </h2>
        <div className="text-lg text-gray-700 mb-4">
          <p>Your booking has been received. We will contact you shortly.</p>
        </div>
        <div>
          <button
            className="bg-purple-500 text-white w-full py-3 rounded-lg mt-6"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
