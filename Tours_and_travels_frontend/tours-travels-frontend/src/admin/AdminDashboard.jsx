import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getPendingPackagesAdminApi,
  getAllBookingsAdminApi,
  getAllPaymentsAdminApi,
  getAllUsersApi,
  cancelBookingByAdmin,
  confirmBookingAdminApi,
} from "../api/adminApi";

import { getUserRole, logout } from "../utils/auth";
import { useTheme } from "../customer/CustomerThemeContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const themeContext = useTheme();
  const { theme } = themeContext || { theme: "day" };

  const [pendingPackages, setPendingPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  useEffect(() => {
    const role = getUserRole();
    if (role !== "ADMIN") {
      navigate("/unauthorized");
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        pendingPkgRes,
        bookingRes,
        paymentRes,
        userRes,
      ] = await Promise.all([
        getPendingPackagesAdminApi(),
        getAllBookingsAdminApi(),
        getAllPaymentsAdminApi(),
        getAllUsersApi(),
      ]);

      setPendingPackages(pendingPkgRes.data || []);
      setBookings(bookingRes.data || []);
      setPayments(paymentRes.data || []);
      setUsers(userRes.data || []);

    } catch (error) {
      console.error("Admin dashboard load failed", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to access admin resources.");
        navigate("/unauthorized");
      } else {
        toast.error("Failed to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    confirmCancelBooking(bookingId);
  };

  const confirmCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await cancelBookingByAdmin(bookingId);
      toast.success("Booking cancelled successfully");
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to confirm this booking?")) {
      return;
    }
    confirmConfirmBooking(bookingId);
  };

  const confirmConfirmBooking = async (bookingId) => {
    try {
      setLoading(true);
      await confirmBookingAdminApi(bookingId);
      toast.success("Booking confirmed successfully");
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "CONFIRMED":
      case "APPROVED":
        return <span className="badge bg-success">Confirmed</span>;
      case "CANCELLED":
      case "REJECTED":
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div style={backgroundStyle} className="d-flex align-items-center justify-content-center">
        <div className="text-center text-white">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="container">

        {/* ================= HEADER ================= */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
          <div>
            <h1 className={`fw-bold ${theme === "night" ? "text-white" : "text-dark"}`}>
              👨‍💼 Admin Dashboard
            </h1>
            <p className={`${theme === "night" ? "text-light" : "text-muted"}`}>
              Manage bookings, packages, and users
            </p>
          </div>
          <button
            className="btn btn-danger btn-lg shadow-sm"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="row mb-5">
          {[
            {
              title: "Pending Packages",
              count: pendingPackages.length,
              path: "/admin/manage-packages",
              color: "warning",
              icon: "📦",
            },
            {
              title: "Pending Payments",
              count: bookings.filter(b => b.paymentStatus !== "PAID").length,
              path: "/admin/manage-bookings",
              color: "danger",
              icon: "💳",
            },
            {
              title: "Total Bookings",
              count: bookings.length,
              path: "/admin/manage-bookings",
              color: "success",
              icon: "📅",
            },
            {
              title: "Total Payments",
              count: payments.length,
              path: "/admin/manage-payments",
              color: "info",
              icon: "💰",
            },
            {
              title: "Total Users",
              count: users.length,
              path: "/admin/manage-users",
              color: "primary",
              icon: "👥",
            },
          ].map((card, idx) => (
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3" key={idx}>
              <div
                className={`card text-center shadow-lg border-0 h-100 hover-lift`}
                style={{
                  background: theme === "night" 
                    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  borderLeft: `4px solid #${{ warning: "ffc107", danger: "dc3545", success: "28a745", info: "17a2b8", primary: "007bff" }[card.color]}`,
                  cursor: "pointer",
                  transform: "transition: 0.3s",
                }}
                onClick={() => navigate(card.path)}
              >
                <div className="card-body">
                  <div style={{ fontSize: "2rem" }} className="mb-2">{card.icon}</div>
                  <h6 className={theme === "night" ? "text-light" : "text-muted"}>{card.title}</h6>
                  <h2 className={`text-${card.color} fw-bold`}>{card.count}</h2>
                  <button
                    className={`btn btn-${card.color} btn-sm mt-2 w-100`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(card.path);
                    }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= RECENT BOOKINGS ================= */}
        <div className={`card shadow-lg border-0 ${theme === "night" ? "bg-dark text-light" : ""}`}>
          <div className="card-header bg-gradient" style={{ background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)" }}>
            <h5 className="text-white mb-0">📊 Recent Bookings</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className={`table ${theme === "night" ? "table-dark" : "table-light"} align-middle`}>
                <thead className={theme === "night" ? "table-secondary" : "table-light"}>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th style={{ width: "200px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.slice(0, 5).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <p className="text-muted mb-0">No bookings found</p>
                      </td>
                    </tr>
                  ) : (
                    bookings.slice(0, 5).map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span className="badge bg-secondary">#{b.id}</span>
                        </td>
                        <td>{b.customerName}</td>
                        <td>{b.packageName}</td>
                        <td>{getStatusBadge(b.status)}</td>
                        <td>
                          {b.status === "PENDING" ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleConfirmBooking(b.id)}
                              >
                                ✓ Confirm
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancelBooking(b.id)}
                              >
                                ✕ Cancel
                              </button>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        }
        .bg-gradient {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;