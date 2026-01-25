import { Routes, Route, Navigate } from "react-router-dom";

/* ========== Public Pages ========== */
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

/* ========== Layouts ========== */
import CustomerLayout from "../customer/CustomerLayout";

/* ========== Admin Pages ========== */
import AdminDashboard from "../admin/AdminDashboard";
import ManageBookings from "../admin/ManageBookings";
import ManageAdminPackages from "../admin/ManageAdminPackages";
import ManagePayments from "../admin/ManagePayments";
import ManageUsers from "../admin/ManageUsers";

/* ========== Agent Pages ========== */
import AgentDashboard from "../agent/AgentDashboard";
import AgentPackages from "../agent/AgentPackages";
import AgentBookings from "../agent/AgentBookings";

/* ========== Customer Pages ========== */
import CustomerDashboard from "../customer/CustomerDashboard";
import CustomerPackages from "../customer/CustomerPackages";
import CustomerBookings from "../customer/CustomerBookings";
import CustomerProfile from "../customer/CustomerProfile";

/* ========== Auth Utils ========== */
import { isAuthenticated, getUserRole } from "../utils/auth";

/* ========== Route Guard ========== */
const ProtectedRoute = ({ children, role }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role && getUserRole() !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-packages"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageAdminPackages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-bookings"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-payments"
        element={
          <ProtectedRoute role="ADMIN">
            <ManagePayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      {/* ================= AGENT ================= */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute role="AGENT">
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/packages"
        element={
          <ProtectedRoute role="AGENT">
            <AgentPackages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/bookings"
        element={
          <ProtectedRoute role="AGENT">
            <AgentBookings />
          </ProtectedRoute>
        }
      />

      {/* ================= CUSTOMER ================= */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute role="CUSTOMER">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="packages" element={<CustomerPackages />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
