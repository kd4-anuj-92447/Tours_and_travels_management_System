import { Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH & COMMON ================= */
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

/* ================= DASHBOARDS ================= */
import AdminDashboard from "../admin/AdminDashboard";
import AgentDashboard from "../agent/AgentDashboard";
import CustomerDashboard from "../customer/CustomerDashboard";

/* ================= CUSTOMER ================= */
import CustomerPackages from "../customer/CustomerPackages";
import MyBookings from "../customer/MyBookings";
import MyProfile from "../customer/MyProfile";
/* ================= ROLE GUARD ================= */
const RequireRole = ({ role, children }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ===== ADMIN ===== */}
      <Route
        path="/admin"
        element={
          <RequireRole role="ADMIN">
            <AdminDashboard />
          </RequireRole>
        }
      />

      {/* ===== AGENT ===== */}
      <Route
        path="/agent"
        element={
          <RequireRole role="AGENT">
            <AgentDashboard />
          </RequireRole>
        }
      />

      {/* ===== CUSTOMER ===== */}
      <Route
        path="/customer"
        element={
          <RequireRole role="CUSTOMER">
            <CustomerDashboard />
          </RequireRole>
        }
      >
        
        <Route path="/customer" element={<CustomerDashboard />} />
    <Route path="/customer/packages" element={<CustomerPackages />} />
    <Route path="/customer/my-bookings" element={<MyBookings />} />
    <Route path="/customer/profile" element={<MyProfile />} />

      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
