import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyPackagesApi,
  getAgentBookingsApi,
} from "../api/agentApi";
import { getUserRole, logout } from "../utils/auth";
import { toast } from "react-toastify";

const AgentDashboard = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const role = getUserRole();
    if (role !== "AGENT") {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [pkgRes, bookingRes] = await Promise.all([
        getMyPackagesApi(),       // ✅ FIXED HERE
        getAgentBookingsApi(),
      ]);

      setPackages(pkgRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Agent Dashboard</h3>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Packages</h6>
              <h2>{packages.length}</h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/agent/packages")}
              >
                View Packages
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Bookings</h6>
              <h2>{bookings.length}</h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/agent/bookings")}
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Create New Package</h6>
              <h2>+</h2>
              <button
                className="btn btn-success btn-sm"
                onClick={() => navigate("/agent/create-package")}
              >
                Create Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
