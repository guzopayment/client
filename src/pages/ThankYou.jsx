import back from "../assets/home.png";
import buyMeCoffee from "../assets/buyMeCoffee.gif";

// const DEVELOPER_BANK = "CBE";
const DEVELOPER_ACCOUNT_NUMBER = "1000254897837";
const TELEBIRR_PHONE_NUMBER = "0955168453";
const DEVELOPER_ACCOUNT_NAME = "Semahegn Tilahun Demelashe";

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
            <strong>
              ✅ ቅጽዎትን በትክክል ሞልተው አስገብተዋል። እናመሰግናለን! በተሎም እናሳውቅዎታለን።✅
            </strong>{" "}
            Your questionnaire has been received. We will contact you shortly.
            ተጨማሪ የሌላ ሰው መረጃ መሙላት ከፈለጉ ከታች ያልለውን የቤት ምልክት ይንኩ፤ ወደ መነሻ ገጽ ይመለሳሉ።
          </p>
        </div>
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-left">
          <h3 className="font-extrabold text-yellow-800 text-lg mb-3">
            <img
              src={buyMeCoffee}
              alt="Click On "
              srcset=""
              className="w-24 h-18 mx-6 rounded-full"
            />
            ይህን ሲስተም የሰራውን ሰው ቡና ይጋብዙት | By a Coffee for the Developer
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            ፈቃደኛ ከሆኑ ይህን ሲስተም የሰራውን ሰው ቡና ይጋብዙት | If you are volunteer to
            support this system developer, Buy a Coffee.
          </p>

          <div className="mt-4 space-y-2 text-sm md:text-base">
            <p>
              <span className="font-bold">CBE Account Number:</span>{" "}
              <strong>{DEVELOPER_ACCOUNT_NUMBER}</strong>
            </p>
            <p>
              <span className="font-bold">Telebirr phone number:</span>{" "}
              <strong>{TELEBIRR_PHONE_NUMBER}</strong>
            </p>
            <p>
              <span className="font-bold">Account Name:</span>{" "}
              {DEVELOPER_ACCOUNT_NAME}
            </p>
          </div>
        </div>
        <div>
          <button
            className="bg-purple-500 text-white w-full py-3 rounded-lg mt-6"
            onClick={() => (window.location.href = "/")}
          >
            <img src={back} alt="back" className="w-5 h-5 inline mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
