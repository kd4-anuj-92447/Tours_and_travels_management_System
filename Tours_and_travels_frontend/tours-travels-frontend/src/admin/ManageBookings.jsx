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
      setBookings(res.data || []);
    } catch (error) {
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
      toast.success("Booking confirmed");
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (id) => {
    setConfirmAction(id);
    toast.info("Confirm cancellation?", {
      position: "top-center",
      autoClose: false,
    });
  };

  const confirmCancelBooking = async (id) => {
    try {
      setLoading(true);
      await cancelBookingByAdmin(id);
      toast.success("Booking cancelled");
      setConfirmAction(null);
      await loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Bookings</h2>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Package</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.customerName}</td>
              <td>{b.packageName}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => confirmBooking(b.id)}
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
                )}
                {b.status !== "PENDING" && <span>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
