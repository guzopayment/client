// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import AdminLogin from "./pages/AdminLogin";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import ProtectedRoute from "./components/admin/ProtectedRoute";
// // import Home from "./pages/Home";
// // import UserDashboard from "./pages/UserDashboard";
// // import AdminStats from "./pages/AdminStats";
// // import AdminReport from "./pages/AdminReport";
// // import AdminHistory from "./pages/AdminHistory";
// // import ErrorBoundary from "./components/ErrorBoundary";
// // import ThankYou from "./pages/ThankYou";
// // import QuestionnaireForm from "./pages/QuestionnaireForm";
// // import AdminQuestionnaire from "./pages/AdminQuestionnaire";
// // import AdminQuestionnairePrint from "./pages/AdminQuestionnairePrint";
// // import QuestionnairViewDashboard from "./pages/QuestionnaireViewDashboard";

// // export default function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* PUBLIC ROUTES */}
// //         <Route path="/" element={<Home />} />
// //         <Route path="/questionnaire" element={<QuestionnaireForm />} />
// //         <Route path="/thank-you" element={<ThankYou />} />
// //         <Route path="/user-dashboard" element={<UserDashboard />} />

// //         {/* ADMIN LOGIN */}
// //         <Route path="/admin-login" element={<AdminLogin />} />

// //         {/* PROTECTED ADMIN ROUTES */}
// //         <Route
// //           path="/admin-dashboard"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <AdminDashboard />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/admin-questionnaire"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <AdminQuestionnaire />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/admin-report"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <AdminReport />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/admin-stats"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <AdminStats />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/admin-history"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <AdminHistory />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/admin-questionnaire-print"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <AdminQuestionnairePrint />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/questionnaire-view-dashboard"
// //           element={
// //             <ProtectedRoute>
// //               <ErrorBoundary>
// //                 <QuestionnairViewDashboard />
// //               </ErrorBoundary>
// //             </ProtectedRoute>
// //           }
// //         />

// //         {/* FALLBACK */}
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminQuestionnaire from "./pages/AdminQuestionnaire";
// import AdminReport from "./pages/AdminReport";
// import AdminStats from "./pages/AdminStats";
// import AdminHistory from "./pages/AdminHistory";
// import AdminQuestionnairePrint from "./pages/AdminQuestionnairePrint";
// import QuestionnaireViewDashboard from "./pages/QuestionnaireViewDashboard";
// import QuestionnaireForm from "./pages/QuestionnaireForm";
// import ThankYou from "./pages/ThankYou";
// import UserDashboard from "./pages/UserDashboard";
// import ErrorBoundary from "./components/ErrorBoundary";
// import ProtectedRoute from "./components/admin/ProtectedRoute";
// import SessionManager from "./components/admin/SessionManager";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <SessionManager />
//       <Routes>
//         {/* PUBLIC ROUTES / client */}
//         <Route path="/" element={<Home />} />
//         <Route path="/questionnaire" element={<QuestionnaireForm />} />
//         <Route path="/thank-you" element={<ThankYou />} />
//         <Route path="/user-dashboard" element={<UserDashboard />} />
//         {/* ADMIN LOGIN */}
//         <Route path="/admin-login" element={<AdminLogin />} />

//         {/* PROTECTED ADMIN ROUTES */}
//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AdminDashboard />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin-questionnaire"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AdminQuestionnaire />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin-report"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AdminReport />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin-stats"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AdminStats />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin-history"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AdminHistory />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin-questionnaire-print"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AdminQuestionnairePrint />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/questionnaire-view-dashboard"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <QuestionnaireViewDashboard />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuestionnaire from "./pages/AdminQuestionnaire";
import AdminReport from "./pages/AdminReport";
import AdminStats from "./pages/AdminStats";
import AdminHistory from "./pages/AdminHistory";
import AdminQuestionnairePrint from "./pages/AdminQuestionnairePrint";
import QuestionnaireViewDashboard from "./pages/QuestionnaireViewDashboard";
import QuestionnaireForm from "./pages/QuestionnaireForm";
import ThankYou from "./pages/ThankYou";
import UserDashboard from "./pages/UserDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SessionManager from "./components/admin/SessionManager";
import Footer from "./components/Footer";
import BackToTopButton from "./components/BackToTopButton";

export default function App() {
  return (
    <BrowserRouter>
      <SessionManager />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<QuestionnaireForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />

            {/* ADMIN LOGIN */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* PROTECTED ADMIN ROUTES */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-questionnaire"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminQuestionnaire />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-report"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminReport />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-stats"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminStats />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-history"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminHistory />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-questionnaire-print"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminQuestionnairePrint />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            <Route
              path="/questionnaire-view-dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <QuestionnaireViewDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
        <BackToTopButton />
      </div>
    </BrowserRouter>
  );
}
