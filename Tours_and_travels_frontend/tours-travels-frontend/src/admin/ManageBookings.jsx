import { useEffect, useState } from "react";
import { getAllBookings, cancelBookingByAdmin } from "../api/adminApi";
import { toast } from "react-toastify";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  const load = () =>
    getAllBookings().then(res => setBookings(res.data));

  useEffect(load, []);

  return (
    <div className="container mt-4">
      <h3>📋 All Bookings</h3>

      <table className="table table-striped table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Customer</th>
            <th>Tour</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.customerName}</td>
              <td>{b.tourName}</td>
              <td>
                <span className="badge bg-info">{b.status}</span>
              </td>
              <td>
                {b.status !== "CANCELLED" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      await cancelBookingByAdmin(b._id);
                      toast.error("Booking cancelled");
                      load();
                    }}
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

export default ManageBookings;
