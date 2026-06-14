import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminQuestionnaire from "./pages/AdminQuestionnaire";
import AdminHistory from "./pages/AdminHistory";
import AdminQuestionnairePrint from "./pages/AdminQuestionnairePrint";
import QuestionnaireViewDashboard from "./pages/QuestionnaireViewDashboard";
import QuestionnaireForm from "./pages/QuestionnaireForm";
import ThankYou from "./pages/ThankYou";
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
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<QuestionnaireForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin-login" element={<AdminLogin />} />

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
        <BackToTopButton />
      </div>
    </BrowserRouter>
  );
}
