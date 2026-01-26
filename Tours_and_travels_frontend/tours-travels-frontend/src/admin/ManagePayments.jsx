import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllPaymentsAdminApi,
  confirmPaymentAdminApi
} from "../api/adminApi";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPaymentsAdminApi();
      const paymentData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setPayments(paymentData);
      console.log("Loaded payments:", paymentData);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error(error.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const confirmPayment = async (id) => {
    try {
      setLoading(true);
      await confirmPaymentAdminApi(id);
      toast.success("Payment confirmed successfully");
      await loadPayments();
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error(error.response?.data?.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Manage Payments</h2>

      {payments.length === 0 ? (
        <div className="alert alert-info mt-3">
          No payments found in the system.
        </div>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.booking?.id || p.bookingId}</td>
                <td>{p.booking?.user?.name || "N/A"}</td>
                <td>₹ {p.booking?.amount || p.amount || "0"}</td>
                <td>
                  <span className={`badge bg-${p.status === "PENDING" ? "warning" : p.status === "SUCCESS" ? "success" : "secondary"}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  {p.status === "PENDING" ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => confirmPayment(p.id)}
                      disabled={loading}
                    >
                      Confirm
                    </button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagePayments;
