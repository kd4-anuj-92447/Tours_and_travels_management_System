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

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [pendingPackages, setPendingPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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

  /* ================= ACTIONS ================= */

   const handleCancelBooking = async (bookingId) => {
    setConfirmAction({ type: "cancel", bookingId });
    toast.info("Confirm cancellation?", {
      position: "top-center",
      autoClose: false,
    });
  };

  const confirmCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await cancelBookingByAdmin(bookingId);
      toast.success("Booking cancelled successfully");
      setConfirmAction(null);
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    setConfirmAction({ type: "confirm", bookingId });
    toast.info("Confirm this booking?", {
      position: "top-center",
      autoClose: false,
    });
  };

  const confirmConfirmBooking = async (bookingId) => {
    try {
      setLoading(true);
      await confirmBookingAdminApi(bookingId);
      toast.success("Booking confirmed successfully");
      setConfirmAction(null);
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BADGE HELPER ================= */

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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Admin Dashboard</h3>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>


      
      {/* ================= SUMMARY CARDS ================= */}
      <div className="row mb-4">

        {[
          {
            title: "Pending Packages",
            count: pendingPackages.length,
            path: "/admin/manage-packages",
            color: "warning",
          },
          {
            title: "Total Bookings",
            count: bookings.length,
            path: "/admin/manage-bookings",
            color: "success",
          },
          {
            title: "Total Payments",
            count: payments.length,
            path: "/admin/manage-payments",
            color: "info",
          },
          {
            title: "Total Users",
            count: users.length,
            path: "/admin/manage-users",
            color: "primary",
          },
        ].map((card, idx) => (
          <div className="col-md-3 mb-3" key={idx}>
            <div className={`card text-center shadow-sm border-${card.color}`}>
              <div className="card-body">
                <h6 className="text-muted">{card.title}</h6>
                <h2 className={`text-${card.color}`}>{card.count}</h2>
                <button
                  className={`btn btn-${card.color} btn-sm`}
                  onClick={() => navigate(card.path)}
                >
                  Open
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* ================= RECENT BOOKINGS ================= */}
      <h5 className="mb-3">Recent Bookings</h5>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
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
                <td colSpan="5" className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.slice(0, 5).map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
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
                          Confirm
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelBooking(b.id)}
                        >
                          Cancel
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
  );
};

export default AdminDashboard;