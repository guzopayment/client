export default function ThankYou() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-extrabold mb-6 bg-purple-900 text-white py-3 rounded">
          እናመሰግናለን!|Thank You!
        </h2>
        <div className="text-lg text-gray-700 mb-4">
          <p>
            {" "}
            የክፍያ ደረሰኝዎትንና ቅጽዎትን በትክክል ሞልተዋል፣ እናመሰግናለን! በተሎም እናሳውቅዎታለን። Your
            booking has been received. We will contact you shortly. ተጨማሪ መረጃ
            መሙላት ከፈለጉ ከታች ያልለውን የቤት ምልክት ይንኩ፤ ወደ መነሻ ገጽ ይመለሳሉ።
          </p>
        </div>
        <div>
          <button
            className="bg-purple-500 text-white w-full py-3 rounded-lg mt-6"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/back-icon.png"
              alt="Back Icon"
              className="w-5 h-5 inline mr-2"
            />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
