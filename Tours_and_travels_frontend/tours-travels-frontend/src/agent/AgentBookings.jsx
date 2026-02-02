// React hooks for lifecycle, state management, and mutable references
import { useEffect, useState, useRef } from "react";

// Hook for programmatic navigation
import { useNavigate } from "react-router-dom";

// Toast notifications for success/error messages
import { toast } from "react-toastify";

// API calls related to agent bookings
import {
  getAgentBookingsApi,
  updateBookingStatusApi,
} from "../api/agentApi";

// Utility function to get logged-in user's role
import { getUserRole } from "../utils/auth";

const AgentBookings = () => {
  // Used to redirect users to other routes
  const navigate = useNavigate();

  // State to store list of bookings assigned to the agent
  const [bookings, setBookings] = useState([]);

<<<<<<< HEAD
  const hasLoaded = useRef(false);

  useEffect(() => {
=======
  // Ref to ensure useEffect runs only once (prevents double execution in React StrictMode)
  const hasLoaded = useRef(false);

  // Runs when component is mounted
  useEffect(() => {
    // Prevents re-execution if already loaded once
>>>>>>> 9d81333920e2195c9e40828441ee2eb819d45013
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    // Role-based access control: only AGENT can access this page
    if (getUserRole() !== "AGENT") {
      navigate("/unauthorized");
      return;
    }

    // Load agent-specific bookings from backend
    loadBookings();
  }, []);

  // Fetch all bookings related to the logged-in agent
  const loadBookings = async () => {
    try {
      const res = await getAgentBookingsApi();
      // Safely set bookings or empty array if response is null
      setBookings(res.data || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  // Handle approve/reject action by agent
  const handleDecision = async (bookingId, decision) => {
    try {
      // Update booking status (APPROVE / REJECT)
      await updateBookingStatusApi(bookingId, decision);

      // Show success message
      toast.success(`Booking ${decision.toLowerCase()}ed`);

      // Reload bookings to reflect updated status
      loadBookings();
    } catch {
      toast.error("Action failed");
    }
  };

  // Returns badge UI based on booking status
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
            {/* If no bookings exist, show message */}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              // Render bookings dynamically
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.packageName}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.tourStartDate}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {/* Allow action only if booking is pending */}
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
                      // No action allowed for non-pending bookings
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

// Export component for use in routes
export default AgentBookings;
