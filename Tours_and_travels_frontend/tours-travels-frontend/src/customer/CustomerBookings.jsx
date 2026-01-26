import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./CustomerThemeContext";

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
  const themeContext = useTheme();
  const { theme } = themeContext || { theme: "day" };
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getMyBookingsCustomerApi();
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load bookings", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={backgroundStyle} className="d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className={`mt-3 ${theme === "night" ? "text-white" : "text-dark"}`}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="mb-5">
          <h2 className={`fw-bold display-5 ${theme === "night" ? "text-white" : "text-dark"}`}>
            📅 My Bookings
          </h2>
          <p className={`lead ${theme === "night" ? "text-light" : "text-muted"}`}>
            Manage and track your tour bookings
          </p>
        </div>

        {bookings.length === 0 && (
          <div className={`card border-0 shadow-lg text-center p-5 ${theme === "night" ? "bg-dark text-light" : ""}`}>
            <h4>✈️ No Bookings Yet</h4>
            <p className={theme === "night" ? "text-light" : "text-muted"}>
              You haven't booked any packages yet. Start exploring our amazing tours!
            </p>
            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={() => navigate("/customer/packages")}
            >
              🏖️ Browse Packages
            </button>
          </div>
        )}

        <div className="row g-4">
          {bookings.map((booking) => (
            <div className="col-lg-4 col-md-6 mb-4" key={booking.id}>
              <div className={`card shadow-lg border-0 h-100 hover-lift ${theme === "night" ? "bg-dark text-light" : ""}`}>

                {/* Package Image */}
                {booking.packageImage && (
                  <img
                    src={booking.packageImage}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt="Package"
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">
                    {booking.packageTitle}
                  </h5>

                  <div className="mb-3">
                    <small className={theme === "night" ? "text-light" : "text-muted"}>Booking Status</small>
                    <div className="mt-1">
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className={theme === "night" ? "text-light" : "text-muted"}>Payment Status</small>
                    <div className="mt-1">
                      <StatusBadge
                        status={booking.paymentStatus || "UNPAID"}
                      />
                    </div>
                  </div>

                  <p className="fw-bold text-success mb-3">
                    ₹{booking.amount}
                  </p>

                  {/* ================= ACTIONS ================= */}

                  {/* Pay Now */}
                  {booking.status === "CONFIRMED" &&
                    booking.paymentStatus !== "PAID" && (
                      <button
                        className="btn btn-success mt-auto w-100 fw-bold shadow-sm"
                        onClick={() =>
                          navigate(
                            `/customer/payment/${booking.id}`
                          )
                        }
                      >
                        💳 Pay Now
                      </button>
                    )}

                  {/* Pending - Awaiting Payment */}
                  {booking.status === "PENDING" && booking.paymentStatus !== "PAID" && (
                    <div className="alert alert-warning mt-auto mb-0 border-0">
                      <small className="fw-bold">⏳ Awaiting Payment</small>
                      <br />
                      <button
                        className="btn btn-sm btn-primary mt-2 w-100 fw-bold"
                        onClick={() =>
                          navigate(
                            `/customer/payment/${booking.id}`
                          )
                        }
                      >
                        Complete Payment
                      </button>
                    </div>
                  )}

                  {/* Cancelled */}
                  {booking.status?.includes("CANCELLED") && (
                    <div className={`alert alert-danger mt-auto mb-0 border-0 ${theme === "night" ? "bg-danger" : ""}`}>
                      <small className="fw-bold">✕ Booking Cancelled</small>
                    </div>
                  )}

                  {/* Paid */}
                  {booking.paymentStatus === "PAID" && !booking.status?.includes("CANCELLED") && (
                    <div className="alert alert-success mt-auto mb-0 border-0">
                      <small className="fw-bold">✓ Payment Completed</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};
  
export default CustomerBookings;
