import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAgentBookingsApi,
  updateBookingStatusApi,
} from "../api/agentApi";

import { getUserRole } from "../utils/auth";

const AgentBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    if (getUserRole() !== "AGENT") {
      navigate("/unauthorized");
      return;
    }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getAgentBookingsApi();
      setBookings(res.data || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  const handleDecision = async (bookingId, decision) => {
    try {
      await updateBookingStatusApi(bookingId, decision);
      toast.success(`Booking ${decision.toLowerCase()}ed`);
      loadBookings();
    } catch {
      toast.error("Action failed");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "AGENT_APPROVED":
        return <span className="badge bg-info">Agent Approved</span>;
      case "AGENT_REJECTED":
        return <span className="badge bg-danger">Rejected</span>;
      case "CONFIRMED":
        return <span className="badge bg-success">Confirmed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Bookings on Your Packages</h3>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Booking Date</th>
              <th>Tour Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.packageName}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.tourStartDate}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {b.status === "PENDING" ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleDecision(b.id, "APPROVE")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDecision(b.id, "REJECT")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentBookings;
