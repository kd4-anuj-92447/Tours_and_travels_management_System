import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./CustomerThemeContext";

import { getApprovedPackagesApi } from "../api/customerApi";
import { createBookingApi } from "../api/bookingApi";

/* Status badge */
const StatusBadge = () => (
  <span className="badge bg-success">✓ APPROVED</span>
);

const CustomerPackages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeContext = useTheme();
  const { theme } = themeContext || { theme: "day" };

  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

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

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    // Handle search from URL params
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
      handleSearch(urlSearch);
    }
  }, [searchParams]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getApprovedPackagesApi();
      console.log("✅ Packages response:", res);
      console.log("✅ Packages data:", res.data);
      const packagesList = Array.isArray(res.data) ? res.data : [];
      console.log("✅ Packages list:", packagesList);
      setPackages(packagesList);
      setFilteredPackages(packagesList);
      if (packagesList.length === 0) {
        console.warn("⚠️  No packages found from API");
      }
    } catch (error) {
      console.error("❌ Error loading packages:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      console.error("❌ Full error object:", JSON.stringify(error));
      setError(`Failed to load packages: ${error.response?.data?.message || error.message}`);
      toast.error("Failed to load packages", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  /* 🔍 Search from navbar - Filter by destination primarily */
  const handleSearch = (query) => {
    if (!query) {
      setFilteredPackages(packages);
      setSearchQuery("");
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = packages.filter(
      (pkg) =>
        // Primary search: destination
        pkg.destination?.toLowerCase().includes(searchTerm) ||
        // Secondary: title and description
        pkg.title?.toLowerCase().includes(searchTerm) ||
        pkg.description?.toLowerCase().includes(searchTerm)
    );

    setFilteredPackages(results);
    setSearchQuery(query);
    
    if (results.length === 0) {
      toast.info(`No packages found for "${query}"`);
    }
  };

  /* ✅ BOOK NOW – CREATE BOOKING AND NAVIGATE TO PAYMENT */
  const handleBookNow = async (packageId) => {
    try {
      setLoadingId(packageId);

      const response = await createBookingApi(packageId);
      const bookingId = response.data.id || response.data?.bookingId;

      toast.success(
        "Booking created! Proceeding to payment...",
        { autoClose: 1000 }
      );

      // Redirect to payment page with the booking ID
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

  return (
    <div style={backgroundStyle}>
      <div className="container">
        {/* HEADER */}
        <div className="mb-5 pb-4">
          <h2 className={`fw-bold display-5 ${theme === "night" ? "text-white" : "text-dark"}`}>
            🏖️ Browse Tour Packages
          </h2>
          <p className={`lead ${theme === "night" ? "text-light" : "text-muted"}`}>
            Discover our amazing collection of travel packages
          </p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className={`mt-3 ${theme === "night" ? "text-white" : "text-dark"}`}>Loading packages...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}

        {!loading && !error && filteredPackages.length === 0 && (
          <div className="alert alert-info">
            No packages found. Please check back later or contact support.
          </div>
        )}

        {!loading && (
          <div className="row g-4">
            {filteredPackages.map((pkg) => (
              <div className="col-lg-4 col-md-6 mb-4" key={pkg.id}>
                <div className={`card shadow-lg border-0 h-100 hover-lift ${theme === "night" ? "bg-dark text-light" : ""}`}>

                  {/* Image Carousel */}
                  {pkg.imageUrls && pkg.imageUrls.length > 0 && (
                    <div
                      id={`carousel-${pkg.id}`}
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {pkg.imageUrls.map((img, i) => (
                          <div
                            key={i}
                            className={`carousel-item ${i === 0 ? "active" : ""}`}
                          >
                            <img
                              src={img}
                              className="d-block w-100"
                              style={{
                                height: "220px",
                                objectFit: "cover",
                              }}
                              alt="Package"
                            />
                          </div>
                        ))}
                      </div>

                      {pkg.imageUrls.length > 1 && (
                        <>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${pkg.id}`}
                            data-bs-slide="prev"
                          >
                            <span className="carousel-control-prev-icon" />
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${pkg.id}`}
                            data-bs-slide="next"
                          >
                            <span className="carousel-control-next-icon" />
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Placeholder if no images */}
                  {!pkg.imageUrls || pkg.imageUrls.length === 0 && (
                    <div
                      style={{
                        height: "220px",
                        backgroundColor: theme === "night" ? "#333" : "#e9ecef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="text-muted">No image available</p>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0 flex-grow-1">{pkg.title}</h5>
                      <StatusBadge />
                    </div>

                    <p className={`card-text small mb-3 ${theme === "night" ? "text-light" : "text-muted"}`}>
                      {pkg.description.length > 80
                        ? pkg.description.substring(0, 80) + "..."
                        : pkg.description}
                    </p>

                    <div className="row mb-3 text-center">
                      <div className="col-6">
                        <small className={theme === "night" ? "text-light" : "text-muted"}>Duration</small>
                        <p className="fw-bold">{pkg.duration || "N/A"} </p>
                      </div>
                      <div className="col-6">
                        <small className={theme === "night" ? "text-light" : "text-muted"}>Price</small>
                        <p className="fw-bold text-success">₹ {pkg.price}</p>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-primary fw-bold shadow-sm"
                        onClick={() => navigate(`/customer/packages/${pkg.id}`)}
                      >
                        👁️ View Details
                      </button>
                      <button
                        className="btn btn-primary fw-bold shadow-sm"
                        disabled={loadingId === pkg.id}
                        onClick={() => handleBookNow(pkg.id)}
                      >
                        {loadingId === pkg.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Booking...
                          </>
                        ) : "🎫 Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerPackages;
