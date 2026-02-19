import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Home from "./pages/Home";
import BookingForm from "./pages/BookingForm";
import UserDashboard from "./pages/UserDashboard";
import AdminStats from "./pages/AdminStats";
import AdminReport from "./pages/AdminReport";
import ErrorBoundary from "./components/ErrorBoundary";
import ThankYou from "./pages/ThankYou";

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
          path="/admin-report"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AdminHistory />
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

        {/* OTHER ROUTES */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
