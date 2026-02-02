// React hooks for lifecycle, state, and reference handling
import { useEffect, useState, useRef } from "react";

// Hook for navigation between routes
import { useNavigate } from "react-router-dom";

// Agent-related API calls
import {
  getMyPackagesApi,
  getAgentBookingsApi,
} from "../api/agentApi";

// Authentication utilities
import { getUserRole, logout } from "../utils/auth";

// Theme context for day/night mode
import { useTheme } from "../customer/CustomerThemeContext";

// Toast notifications
import { toast } from "react-toastify";

const AgentDashboard = () => {
  // Used to redirect users programmatically
  const navigate = useNavigate();

  // Access theme (day / night) from context
  const themeContext = useTheme();
  const { theme } = themeContext || { theme: "day" };

  // State to store agent packages
  const [packages, setPackages] = useState([]);

  // State to store agent bookings
  const [bookings, setBookings] = useState([]);

  // Loading state for dashboard data
  const [loading, setLoading] = useState(false);

  // Dynamic background styling based on theme
  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  // Ref to prevent useEffect from running twice (React StrictMode fix)
  const hasLoaded = useRef(false);

  // Runs once when component mounts
  useEffect(() => {
    // Prevent duplicate execution
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    // Role-based access control
    const role = getUserRole();
    if (role !== "AGENT") {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }

    // Load dashboard data
    loadDashboard();
  }, []);

  // Fetch packages and bookings for agent dashboard
  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Fetch packages and bookings in parallel
      const [pkgRes, bookingRes] = await Promise.all([
        getMyPackagesApi(),
        getAgentBookingsApi(),
      ]);

      // Update state with API response data
      setPackages(pkgRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard");

      // Handle unauthorized or forbidden errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while dashboard data is being fetched
  if (loading) {
    return (
      <div
        style={backgroundStyle}
        className="d-flex align-items-center justify-content-center"
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p
            className={`mt-3 ${
              theme === "night" ? "text-white" : "text-dark"
            }`}
          >
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="container">
        {/* HEADER SECTION */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-4 border-bottom">
          <div>
            <h1
              className={`fw-bold ${
                theme === "night" ? "text-white" : "text-dark"
              }`}
            >
              🎫 Agent Dashboard
            </h1>
            <p
              className={`${theme === "night" ? "text-light" : "text-muted"}`}
            >
              Manage your packages and bookings
            </p>
          </div>

          {/* Logout button */}
          <button
            className="btn btn-danger btn-lg shadow-sm"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="row mb-5">
          {[
            {
              title: "Total Packages",
              count: packages.length,
              path: "/agent/packages",
              color: "primary",
              icon: "📦",
            },
            {
              title: "Total Bookings",
              count: bookings.length,
              path: "/agent/bookings",
              color: "success",
              icon: "📅",
            },
            {
              title: "Create New Package",
              count: "+",
              path: "/agent/create-package",
              color: "info",
              icon: "✨",
            },
          ].map((card, idx) => (
            <div className="col-lg-4 col-md-6 mb-4" key={idx}>
              {/* Clickable dashboard card */}
              <div
                className="card text-center shadow-lg border-0 h-100 hover-lift"
                style={{
                  background:
                    theme === "night"
                      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  borderTop: `4px solid var(--bs-${card.color})`,
                  cursor: "pointer",
                }}
                onClick={() => navigate(card.path)}
              >
                <div className="card-body">
                  <div style={{ fontSize: "2.5rem" }} className="mb-3">
                    {card.icon}
                  </div>
                  <h6
                    className={
                      theme === "night" ? "text-light" : "text-muted"
                    }
                  >
                    {card.title}
                  </h6>
                  <h2 className={`text-${card.color} fw-bold`}>
                    {card.count}
                  </h2>

                  {/* Button inside card */}
                  <button
                    className={`btn btn-${card.color} btn-sm mt-3 w-100`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(card.path);
                    }}
                  >
                    {card.path === "/agent/create-package"
                      ? "Create Now"
                      : "View All"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT PACKAGES SECTION */}
        {packages.length > 0 && (
          <div
            className={`card shadow-lg border-0 mb-5 ${
              theme === "night" ? "bg-dark text-light" : ""
            }`}
          >
            <div
              className="card-header bg-gradient"
              style={{
                background:
                  "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
              }}
            >
              <h5 className="text-white mb-0">📦 Recent Packages</h5>
            </div>

            <div className="card-body">
              <div className="row">
                {packages.slice(0, 3).map((pkg) => (
                  <div className="col-md-4 mb-3" key={pkg.id}>
                    <div
                      className={`card h-100 ${
                        theme === "night" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      <div className="card-body">
                        <h6 className="card-title fw-bold">
                          {pkg.title}
                        </h6>
                        <p className="text-muted small mb-2">
                          <strong>Price:</strong> ₹ {pkg.price}
                        </p>
                        <p className="text-muted small mb-2">
                          <strong>Duration:</strong> {pkg.duration} days
                        </p>
                        <button
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => navigate("/agent/packages")}
                        >
                          View All
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECENT BOOKINGS SECTION */}
        {bookings.length > 0 && (
          <div
            className={`card shadow-lg border-0 ${
              theme === "night" ? "bg-dark text-light" : ""
            }`}
          >
            <div
              className="card-header bg-gradient"
              style={{
                background:
                  "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
              }}
            >
              <h5 className="text-white mb-0">📊 Recent Bookings</h5>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table
                  className={`table ${
                    theme === "night" ? "table-dark" : "table-light"
                  } align-middle`}
                >
                  <thead
                    className={
                      theme === "night"
                        ? "table-secondary"
                        : "table-light"
                    }
                  >
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Package</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span className="badge bg-secondary">
                            #{b.id}
                          </span>
                        </td>
                        <td>{b.customerName}</td>
                        <td>{b.packageName}</td>
                        <td>
                          <span
                            className={`badge ${
                              b.status === "PENDING"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom hover and gradient styles */}
      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        }
        .bg-gradient {
          background: linear-gradient(
            135deg,
            var(--gradient-start, #007bff) 0%,
            var(--gradient-end, #0056b3) 100%
          ) !important;
        }
      `}</style>
    </div>
  );
};

// Export AgentDashboard component
export default AgentDashboard;
