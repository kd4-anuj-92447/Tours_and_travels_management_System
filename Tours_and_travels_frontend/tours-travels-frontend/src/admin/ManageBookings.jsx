import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllBookingsAdminApi,
  confirmBookingAdminApi,
  cancelBookingByAdmin
} from "../api/adminApi";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookingsAdminApi();
      const bookingData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBookings(bookingData);
      console.log("Loaded bookings:", bookingData);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const confirmBooking = async (id) => {
    try {
      setLoading(true);
      await confirmBookingAdminApi(id);
      toast.success("Booking confirmed successfully");
      setConfirmAction(null);
      await loadBookings();
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (id) => {
    setConfirmAction({ type: "cancel", bookingId: id });
    toast.info("Confirm cancellation?", {
      position: "top-center",
      autoClose: false,
    });
  };

  const confirmCancelBooking = async (id) => {
    try {
      setLoading(true);
      await cancelBookingByAdmin(id);
      toast.success("Booking cancelled successfully");
      setConfirmAction(null);
      await loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      "PENDING": "warning",
      "CONFIRMED": "success",
      "CANCELLED": "danger",
      "CANCELLED_BY_CUSTOMER": "danger",
    };
    return (
      <span className={`badge bg-${colors[status] || "secondary"}`}>
        {status}
      </span>
    );
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Manage Bookings</h2>

      {bookings.length === 0 ? (
        <div className="alert alert-info mt-3">
          No bookings found in the system.
        </div>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Amount</th>
              <th>Booking Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user?.name || b.customerName || "N/A"}</td>
                <td>{b.tourPackage?.title || b.packageName || "N/A"}</td>
                <td>₹ {b.amount}</td>
                <td>{getStatusBadge(b.status)}</td>
                <td>
                  <span className={`badge bg-${b.paymentStatus === "PAID" ? "success" : b.paymentStatus === "PENDING" ? "warning" : "secondary"}`}>
                    {b.paymentStatus || "UNPAID"}
                  </span>
                </td>
                <td>
                  {b.status === "PENDING" && b.paymentStatus === "PAID" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => confirmBooking(b.id)}
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {b.status === "PENDING" && b.paymentStatus !== "PAID" && (
                    <span className="text-muted small">Awaiting Payment</span>
                  )}
                  {b.status !== "PENDING" && <span className="text-muted">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirmAction && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmAction(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to cancel this booking?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmAction(null)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => confirmCancelBooking(confirmAction.bookingId)}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
