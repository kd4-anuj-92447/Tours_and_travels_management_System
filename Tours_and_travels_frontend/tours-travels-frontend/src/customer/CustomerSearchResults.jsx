import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./CustomerThemeContext";
import { useState } from "react";
import { createBookingApi } from "../api/bookingApi";
import { toast } from "react-toastify";

const CustomerSearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loadingId, setLoadingId] = useState(null);

  const results = state?.results || [];
  const query = state?.query || "";

  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  const handleBookNow = async (packageId) => {
    try {
      setLoadingId(packageId);
      const response = await createBookingApi(packageId);
      const bookingId = response.data.id || response.data?.bookingId;

      toast.success("Booking created! Proceeding to payment...", { autoClose: 1000 });
      navigate(`/customer/payment/${bookingId}`);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You are not authorized", { autoClose: 1000 });
      } else {
        toast.error(error.response?.data?.message || "Failed to create booking", { autoClose: 1000 });
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewDetails = (packageId) => {
    navigate(`/customer/packages/${packageId}`);
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        {/* HEADER */}
        <div className="mb-5 pb-4">
          <h2 className={`fw-bold display-5 ${theme === "night" ? "text-white" : "text-dark"}`}>
            🔍 Search Results
          </h2>
          <p className={`lead ${theme === "night" ? "text-light" : "text-muted"}`}>
            {results.length} package{results.length !== 1 ? "s" : ""} found for "{query}"
          </p>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/customer/packages")}
          >
            ← Back to All Packages
          </button>
        </div>

        {results.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <h5>No packages found</h5>
            <p>Try searching with different keywords or browse all our packages.</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/customer/packages")}
            >
              Browse All Packages
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {results.map((pkg) => (
              <div className="col-lg-4 col-md-6 mb-4" key={pkg.id}>
                <div className={`card shadow-lg border-0 h-100 ${theme === "night" ? "bg-dark text-light" : ""}`}>
                  {/* IMAGE */}
                  {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
                    <img
                      src={pkg.imageUrls[0]}
                      alt={pkg.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-secondary"
                      style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <span className="text-white">No Image</span>
                    </div>
                  )}

                  {/* BODY */}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{pkg.title}</h5>
                      <span className="badge bg-success">✓ Approved</span>
                    </div>

                    {pkg.destination && (
                      <p className={`small mb-2 ${theme === "night" ? "text-light" : "text-muted"}`}>
                        📍 {pkg.destination}
                      </p>
                    )}

                    {pkg.duration && (
                      <p className={`small mb-2 ${theme === "night" ? "text-light" : "text-muted"}`}>
                        ⏱️ {pkg.duration}
                      </p>
                    )}

                    <p className={`card-text ${theme === "night" ? "text-light" : "text-muted"}`}>
                      {pkg.description?.substring(0, 100)}...
                    </p>

                    <h5 className={`mb-3 ${theme === "night" ? "text-warning" : "text-primary"}`}>
                      ₹ {parseFloat(pkg.price).toLocaleString("en-IN")}
                    </h5>
                  </div>

                  {/* FOOTER */}
                  <div className="card-footer bg-transparent">
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => handleBookNow(pkg.id)}
                      disabled={loadingId === pkg.id}
                    >
                      {loadingId === pkg.id ? "Processing..." : "Book Now"}
                    </button>
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => handleViewDetails(pkg)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearchResults;
