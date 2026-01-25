import { useEffect, useState } from "react";
import {
  getAllPaymentsAdminApi,
  confirmPaymentAdminApi
} from "../api/adminApi";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getAllPaymentsAdminApi()
      .then((res) => setPayments(res.data))
      .catch(() => alert("Failed to load payments"));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Manage Payments</h2>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Booking ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.bookingId}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
              <td>
                {p.status === "PENDING" ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      confirmPaymentAdminApi(p.id).then(() =>
                        setPayments(
                          payments.map(pay =>
                            pay.id === p.id
                              ? { ...pay, status: "CONFIRMED" }
                              : pay
                          )
                        )
                      )
                    }
                  >
                    Confirm
                  </button>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePayments;
