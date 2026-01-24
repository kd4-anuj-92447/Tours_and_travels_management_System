import { useEffect, useState } from "react";
import { getAgentBookingsApi } from "../api/agentApi";
import { updateBookingStatusApi } from "../api/bookingApi";
import { toast } from "react-toastify";

const AgentBookings = () => {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const res = await getAgentBookingsApi();
    setBookings(res.data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    await updateBookingStatusApi(bookingId, status);
    toast.success(`Booking ${status.toLowerCase()}`);
    loadBookings();
  };

  return (
    <div className="container mt-4">
      <h3>Tour Bookings</h3>

      <table className="table table-striped table-hover shadow">
        <thead className="table-primary">
          <tr>
            <th>Customer</th>
            <th>Tour</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No bookings found
              </td>
            </tr>
          )}

          {bookings.map(b => (
            <tr key={b.bookingId}>
              <td>{b.user?.name}</td>
              <td>{b.tourPackage?.title}</td>

              <td>
                <span
                  className={`badge ${
                    b.status === "PENDING"
                      ? "bg-warning"
                      : b.status === "APPROVED"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {b.status}
                </span>
              </td>

              <td>
                {b.status === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() =>
                        updateStatus(b.bookingId, "APPROVED")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        updateStatus(b.bookingId, "REJECTED")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentBookings;
