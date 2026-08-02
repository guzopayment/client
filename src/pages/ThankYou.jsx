import back from "../assets/home.png";
import buyMeCoffee from "../assets/buyMeCoffee.gif";
import subscribe from "../assets/subscribe.gif";
import subscribeM from "../assets/subscribeM.gif";
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
            <small>
              {" "}
              Your questionnaire has been received. We will contact you shortly.
              ተጨማሪ የሌላ ሰው መረጃ መሙላት ከፈለጉ ከታች ያልለውን የቤት ምልክት ይንኩ፤ ወደ መነሻ ገጽ ይመለሳሉ።
            </small>
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 ">
          <h3 className="font-extrabold text-yellow-800 text-lg mb-3">
            <a
              href="https://www.youtube.com/@MuluTilaCodeCamp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>
                ይህን ሲስተም የሰራውን ሰው ቻነል ሰብስክራይብ ያድርጉ| Subscribe the Developer's
                Youtube channel
              </small>
              <img
                src={subscribe}
                alt="Click On "
                srcSet=""
                className="w-60 h-20 mx-6 rounded-full items-center"
              />{" "}
            </a>
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            <small>
              ይህን ሲስተም የሰራውን ዩቱብ ቻነል ሰብስክራይብ ያድርጉ | Please subscribe the
              developer's Youtube channel.
            </small>
          </p>

          <div className="mt-4 space-y-2 text-sm md:text-base">
            <p>
              <small>
                {/* <span className="font-bold">CBE Account Number:</span>{" "}
                  <strong>{DEVELOPER_ACCOUNT_NUMBER}</strong> */}
              </small>
            </p>

            <a
              href="https://youtu.be/Bfp8eIuhhHs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={subscribeM}
                alt="Subscribe"
                className="w-60 h-20 mx-6 rounded-full items-center"
              />
            </a>
            <p>
              or Buy me a coffee &nbsp;
              <small>
                {/* <span className="font-bold">Phone number:</span>{" "} */}
                {/* <strong> */}

                {TELEBIRR_PHONE_NUMBER}
                {/* </strong> */}
              </small>
            </p>
            <p>
              <small>
                {/* <span className="font-bold">Account Name:</span>{" "} */}
                {DEVELOPER_ACCOUNT_NAME}
              </small>
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
