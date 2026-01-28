import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./CustomerThemeContext";

import { getMyBookingsCustomerApi } from "../api/customerApi";
import { cancelBookingByCustomerApi } from "../api/bookingApi";

/* ================= LOCAL STORAGE HELPERS ================= */

const getHiddenKey = (email) => `hiddenBookings_${email}`;

const getHiddenBookings = (email) => {
  try {
    return JSON.parse(localStorage.getItem(getHiddenKey(email))) || [];
  } catch {
    return [];
  }
};

const saveHiddenBooking = (email, bookingId) => {
  const existing = getHiddenBookings(email);
  localStorage.setItem(
    getHiddenKey(email),
    JSON.stringify([...new Set([...existing, bookingId])])
  );
};

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "warning",
    CONFIRMED: "success",
    CANCELLED: "danger",
    CANCELLED_BY_CUSTOMER: "danger",
    SUCCESS: "success",
    FAILED: "danger",
  };

  return (
    <span className={`badge bg-${map[status] || "secondary"}`}>
      {status}
    </span>
  );
};

/* ================= COMPONENT ================= */

const CustomerBookings = () => {
  const navigate = useNavigate();
  const { theme = "day" } = useTheme() || {};

  const customerEmail = localStorage.getItem("email");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasLoaded = useRef(false);

  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')"
        : "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  /* ================= LOAD BOOKINGS ================= */

  const loadBookings = async () => {
    try {
      const res = await getMyBookingsCustomerApi();
      const hidden = getHiddenBookings(customerEmail);

      setBookings(
        (res.data || []).filter((b) => !hidden.includes(b.id))
      );
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadBookings();
  }, []);

  /* ================= CANCEL BOOKING ================= */

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBookingByCustomerApi(bookingId);
      toast.success("Booking cancelled");
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data || "Failed to cancel booking");
    }
  };

  /* ================= DELETE (HIDE) BOOKING ================= */

  const handleDeleteBooking = (bookingId) => {
    if (!window.confirm("Remove this cancelled booking from your list?")) return;

    saveHiddenBooking(customerEmail, bookingId);
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    toast.info("Booking removed from your list");
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div style={backgroundStyle} className="d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" />
          <p className={`mt-3 ${theme === "night" ? "text-white" : "text-dark"}`}>
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="mb-5">
          <h2 className={`fw-bold display-5 ${theme === "night" ? "text-white" : ""}`}>
            📅 My Bookings
          </h2>
          <p className={theme === "night" ? "text-light" : "text-muted"}>
            Manage and track your tour bookings
          </p>
        </div>

        {bookings.length === 0 && (
          <div className="card border-0 shadow-lg text-center p-5">
            <h4>✈️ No Active Bookings</h4>
            <p className="text-muted">All cancelled bookings are hidden.</p>
            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={() => navigate("/customer/packages")}
            >
              🏖️ Browse Packages
            </button>
          </div>
        )}

        <div className="row g-4">
          {bookings.map((booking) => {
            const canPay =
              booking.status === "PENDING" &&
              booking.paymentStatus === "PENDING";

            const canCancel = canPay;

            const isCancelled =
              booking.status === "CANCELLED" ||
              booking.status === "CANCELLED_BY_CUSTOMER";

            return (
              <div className="col-lg-4 col-md-6" key={booking.id}>
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold mb-3">{booking.packageName}</h5>

                    <div className="mb-2">
                      <small>Booking Status</small>
                      <div><StatusBadge status={booking.status} /></div>
                    </div>

                    <div className="mb-3">
                      <small>Payment Status</small>
                      <div><StatusBadge status={booking.paymentStatus} /></div>
                    </div>

                    <p className="fw-bold text-success mb-3">₹{booking.amount}</p>

                    {canPay && (
                      <button
                        className="btn btn-success w-100 mt-auto fw-bold"
                        onClick={() => navigate(`/customer/payment/${booking.id}`)}
                      >
                        💳 Pay Now
                      </button>
                    )}

                    {canCancel && (
                      <button
                        className="btn btn-outline-danger w-100 mt-2"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        ❌ Cancel Booking
                      </button>
                    )}

                    {isCancelled && (
                      <>
                        <div className="alert alert-danger mt-auto mb-2 text-center">
                          ✖ Booking Cancelled
                        </div>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          🗑️ Remove from My Bookings
                        </button>
                      </>
                    )}

                    {booking.paymentStatus === "SUCCESS" &&
                      booking.status === "CONFIRMED" && (
                        <div className="alert alert-success mt-auto mb-0 text-center">
                          ✓ Payment Completed
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerBookings;
