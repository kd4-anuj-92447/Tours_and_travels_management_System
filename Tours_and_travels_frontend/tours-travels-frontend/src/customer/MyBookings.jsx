import { useEffect, useState } from "react";
import { getMyBookingsApi, cancelBookingApi } from "../api/bookingApi";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const loadBookings = () => {
    getMyBookingsApi().then(res => setBookings(res.data));
  };

  useEffect(loadBookings, []);

  const cancel = async (id) => {
    await cancelBookingApi(id);
    toast.success("Booking cancelled");
    loadBookings();
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Bookings</h3>

      <table className="table table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Package</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.bookingId}>
              <td>{b.tourPackage.title}</td>
              <td>{b.status}</td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
              <td>
                {b.status === "PENDING" && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => cancel(b.bookingId)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;
