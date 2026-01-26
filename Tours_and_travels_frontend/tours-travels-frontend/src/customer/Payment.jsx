import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTheme } from "./CustomerThemeContext";

import { createPaymentApi } from "../api/paymentApi";
import { getMyBookingsCustomerApi } from "../api/customerApi";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const themeContext = useTheme();
  const { theme } = themeContext || { theme: "day" };

  const [loading, setLoading] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoadingBooking(true);
      const res = await getMyBookingsCustomerApi();
      const bookings = Array.isArray(res.data) ? res.data : [];
      const currentBooking = bookings.find(b => b.id === parseInt(bookingId));
      
      if (currentBooking) {
        setBooking(currentBooking);
        setError(null);
      } else {
        setError("Booking not found");
        toast.error("Booking not found", { autoClose: 1000 });
      }
    } catch (err) {
      console.error("Error loading booking:", err);
      setError("Failed to load booking details");
      toast.error("Failed to load booking details", { autoClose: 1000 });
    } finally {
      setLoadingBooking(false);
    }
  };

  const payNow = async () => {
    try {
      setLoading(true);

      await createPaymentApi({
        bookingId: parseInt(bookingId),
        paymentMode: "CARD",
      });

      toast.success("Payment successful! Redirecting to bookings...", { autoClose: 1000 });
      navigate("/customer/bookings");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  if (loadingBooking) {
    return (
      <div style={backgroundStyle} className="d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className={`mt-3 ${theme === "night" ? "text-white" : "text-dark"}`}>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={backgroundStyle}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className={`alert alert-danger shadow-lg border-0`} role="alert">
                {error || "Booking not found"}
              </div>
              <button
                className="btn btn-secondary btn-lg w-100"
                onClick={() => navigate("/customer/bookings")}
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            {/* PAYMENT CARD */}
            <div className={`card shadow-lg border-0 ${theme === "night" ? "bg-dark text-light" : ""}`}>
              <div className="card-header bg-gradient" style={{ background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)" }}>
                <h4 className="text-white mb-0 text-center">💳 Complete Payment</h4>
              </div>

              <div className="card-body p-4">
                {/* Booking Details */}
                <div className="mb-4 pb-4 border-bottom">
                  <h6 className="fw-bold mb-3">📋 Booking Details</h6>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <p className={`text-muted mb-1 small`}>Booking ID</p>
                      <p className="fw-bold">#{booking?.id || "N/A"}</p>
                    </div>
                    <div className="col-6">
                      <p className={`text-muted mb-1 small`}>Package</p>
                      <p className="fw-bold">{booking?.packageTitle || "N/A"}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <p className={`text-muted mb-1 small`}>Booking Status</p>
                      <p className="fw-bold">
                        <span className={`badge bg-${booking?.status === "PENDING" ? "warning" : booking?.status === "CONFIRMED" ? "success" : "danger"}`}>
                          {booking?.status || "N/A"}
                        </span>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className={`text-muted mb-1 small`}>Payment Status</p>
                      <p className="fw-bold">
                        <span className={`badge bg-${booking?.paymentStatus === "PAID" ? "success" : "warning"}`}>
                          {booking?.paymentStatus === "PAID" ? "✓ PAID" : "⏳ PENDING"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {booking?.packageImage && (
                    <img
                      src={booking.packageImage}
                      alt={booking.packageTitle}
                      className="img-fluid rounded mb-3 shadow-sm"
                      style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
                    />
                  )}
                </div>

                {/* Payment Amount */}
                <div className="mb-4 pb-4 border-bottom text-center">
                  <p className={`${theme === "night" ? "text-light" : "text-muted"} mb-2 small`}>Total Amount</p>
                  <h2 className="text-success fw-bold">₹{booking?.amount || "0"}</h2>
                </div>

                {/* Payment Status Check */}
                {booking?.paymentStatus === "PAID" ? (
                  <div className="alert alert-success mb-4 border-0">
                    <h5 className="alert-heading">✅ Payment Complete</h5>
                    <p className="mb-0">Your payment has been received. The admin will review and confirm your booking shortly.</p>
                  </div>
                ) : (
                  <>
                    <div className="alert alert-info mb-4 border-0">
                      <strong>ℹ️ Note:</strong> After successful payment, your booking will be sent to the admin for final approval.
                    </div>

                    <button
                      className="btn btn-success btn-lg w-100 shadow-sm fw-bold mb-3"
                      disabled={loading || booking?.paymentStatus === "PAID"}
                      onClick={payNow}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                          Processing...
                        </>
                      ) : (
                        "💰 Pay Now"
                      )}
                    </button>
                  </>
                )}

                <button
                  className={`btn btn-outline-secondary w-100 fw-bold ${theme === "night" ? "text-light border-light" : ""}`}
                  onClick={() => navigate("/customer/packages")}
                >
                  ← Back to Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
        }
      `}</style>
    </div>
  );
};

export default Payment;
