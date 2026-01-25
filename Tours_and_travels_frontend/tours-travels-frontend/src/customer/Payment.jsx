import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import CustomerNavbar from "./CustomerNavbar";
import { createPaymentApi } from "../api/paymentApi";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    try {
      setLoading(true);

      await createPaymentApi({
        bookingId,
        paymentMode: "CARD",
      });

      toast.success("Payment successful", { autoClose: 2000 });
      navigate("/customer/my-bookings");
    } catch (error) {
      toast.error("Payment failed", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomerNavbar />

      <div className="container mt-5">
        <div className="card shadow p-4 text-center">
          <h4 className="mb-3">Complete Payment</h4>

          <p className="text-muted">
            Booking ID: <strong>{bookingId}</strong>
          </p>

          <button
            className="btn btn-success btn-lg"
            disabled={loading}
            onClick={payNow}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
