import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CustomerNavbar from "./CustomerNavbar";
import { getMyBookingsCustomerApi } from "../api/customerApi";

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "warning",
    AGENT_APPROVED: "info",
    CONFIRMED: "success",
    CANCELLED: "danger",
    CANCELLED_BY_CUSTOMER: "secondary",
    PAID: "success",
    UNPAID: "secondary",
  };

  return (
    <span className={`badge bg-${map[status] || "dark"}`}>
      {status}
    </span>
  );
};

/* ================= COMPONENT ================= */

const CustomerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getMyBookingsCustomerApi();
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <CustomerNavbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />

      <div className="container mt-4">
        <h3 className="mb-4">My Bookings</h3>

        {bookings.length === 0 && (
          <p className="text-muted">
            You have not booked any packages yet.
          </p>
        )}

        <div className="row">
          {bookings.map((booking) => (
            <div className="col-md-4 mb-4" key={booking.id}>
              <div className="card shadow-sm h-100">

                {/* Package Image */}
                {booking.packageImage && (
                  <img
                    src={booking.packageImage}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    alt="Package"
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    {booking.packageTitle}
                  </h5>

                  <div className="mb-2">
                    Booking Status:{" "}
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mb-2">
                    Payment Status:{" "}
                    <StatusBadge
                      status={booking.paymentStatus || "UNPAID"}
                    />
                  </div>

                  <p className="fw-bold mb-3">
                    ₹ {booking.amount}
                  </p>

                  {/* ================= ACTIONS ================= */}

                  {/* Pay Now */}
                  {booking.status === "CONFIRMED" &&
                    booking.paymentStatus !== "PAID" && (
                      <button
                        className="btn btn-success mt-auto"
                        onClick={() =>
                          navigate(
                            `/customer/payment/${booking.id}`
                          )
                        }
                      >
                        Pay Now
                      </button>
                    )}

                  {/* Pending */}
                  {booking.status === "PENDING" && (
                    <p className="text-muted mt-auto">
                      Awaiting approval
                    </p>
                  )}

                  {/* Cancelled */}
                  {booking.status?.includes("CANCELLED") && (
                    <p className="text-danger mt-auto">
                      Booking cancelled
                    </p>
                  )}

                  {/* Paid */}
                  {booking.paymentStatus === "PAID" && (
                    <p className="text-success mt-auto">
                      Payment completed
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerBookings;
