import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Home from "./pages/Home";
// import BookingForm from "./pages/BookingForm";
import UserDashboard from "./pages/UserDashboard";
import AdminStats from "./pages/AdminStats";
import AdminReport from "./pages/AdminReport";
import AdminHistory from "./pages/AdminHistory";
import ErrorBoundary from "./components/ErrorBoundary";
import ThankYou from "./pages/ThankYou";
import QuestionnaireForm from "./pages/QuestionnaireForm";
import AdminQuestionnaire from "./pages/AdminQuestionnaire";
// import NoEvent from "./pages/NoEvent";
import AdminQuestionnairePrint from "./pages/AdminQuestionnairePrint";
import QuestionnairViewDashboard from "./pages/QuestionnaireViewDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ✅ PROTECTED ADMIN ROUTES */}
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
        <Route path="/admin-history" element={<AdminHistory />} />
        <Route
          path="/admin-questionnaire-print"
          element={<AdminQuestionnairePrint />}
        />
        <Route
          path="/questionnaire-view-dashboard"
          element={<QuestionnairViewDashboard />}
        />
        {/* OTHER ROUTES */}
        <Route path="/questionnaire" element={<QuestionnaireForm />} />
        <Route path="/admin-questionnaire" element={<AdminQuestionnaire />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        {/* <Route path="/booking" element={<BookingForm />} /> */}
        <Route path="/noevent" element={<NoEvent />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
