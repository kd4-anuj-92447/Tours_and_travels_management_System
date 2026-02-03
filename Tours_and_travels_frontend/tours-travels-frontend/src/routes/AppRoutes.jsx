import { Routes, Route, Navigate } from "react-router-dom";

/* ========== Public Pages ========== */
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AgentRegister from "../pages/AgentRegister";
import Unauthorized from "../pages/Unauthorized";

/* ========== Layouts ========== */
import CustomerLayout from "../customer/CustomerLayout";

/* ========== Admin Pages ========== */
import AdminDashboard from "../admin/AdminDashboard";
import ManageBookings from "../admin/ManageBookings";
import ManageAdminPackages from "../admin/ManageAdminPackages";
import ManagePayments from "../admin/ManagePayments";
import ManageUsers from "../admin/ManageUsers";
import ManageAgentRegistrations from "../admin/ManageAgentRegistrations";

/* ========== Agent Pages ========== */
import AgentDashboard from "../agent/AgentDashboard";
import AgentPackages from "../agent/AgentPackages";
import AgentBookings from "../agent/AgentBookings";
import CreatePackage from "../agent/CreatePackage";
import EditPackage from "../agent/EditPackage";

/* ========== Customer Pages ========== */
import CustomerDashboard from "../customer/CustomerDashboard";
import CustomerPackages from "../customer/CustomerPackages";
import CustomerBookings from "../customer/CustomerBookings";
import CustomerProfile from "../customer/CustomerProfile";
import CustomerSearchResults from "../customer/CustomerSearchResults";
import PackageDetails from "../customer/PackageDetails";
import CustomerCustomizeBooking from "../customer/CustomerCustomizeBooking";
import Payment from "../customer/Payment";

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
      <Route path="/agent-register" element={<AgentRegister />} />
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
      <Route
        path="/admin/agent-registrations"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageAgentRegistrations />
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
      <Route
        path="/agent/create-package"
        element={
          <ProtectedRoute role="AGENT">
            <CreatePackage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/edit-package/:id"
        element={
          <ProtectedRoute role="AGENT">
            <EditPackage />
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
        <Route path="packages/:packageId" element={<PackageDetails />} />
        <Route
          path="customize-booking/:packageId"
          element={<CustomerCustomizeBooking />}
        />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="payment/:bookingId" element={<Payment />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="search-results" element={<CustomerSearchResults />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
