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
        <Route
          path="/admin-dashboard"
          element={
            <ErrorBoundary>
              <AdminDashboard />
            </ErrorBoundary>
          }
        />
        <Route path="/admin-stats" element={<AdminStats />} />
        <Route path="/admin-report" element={<AdminReport />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import UserDashboard from "./pages/UserDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import Login from "./pages/admin/Login";
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/admin/login" element={<Login />} />
//         <Route path="/user-dashboard" element={<UserDashboard />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
