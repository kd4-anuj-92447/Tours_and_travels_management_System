import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "./CustomerThemeContext";
import { getApprovedPackagesApi } from "../api/customerApi";
import { createBookingApi } from "../api/bookingApi";
import { toast } from "react-toastify";

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadPackageDetails();
  }, [packageId]);

  const loadPackageDetails = async () => {
    try {
      setLoading(true);
      const res = await getApprovedPackagesApi();
      const packages = Array.isArray(res.data) ? res.data : [];
      const selectedPackage = packages.find((p) => p.id === parseInt(packageId));
      
      if (selectedPackage) {
        setPkg(selectedPackage);
      } else {
        toast.error("Package not found");
        navigate("/customer/packages");
      }
    } catch (error) {
      console.error("Error loading package:", error);
      toast.error("Failed to load package details");
      navigate("/customer/packages");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    try {
      setBookingLoading(true);
      const response = await createBookingApi(pkg.id);
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
      setBookingLoading(false);
    }
  };

  const nextImage = () => {
    if (pkg?.imageUrls && currentImageIndex < pkg.imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

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

  if (loading) {
    return (
      <div style={backgroundStyle}>
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className={`mt-3 ${theme === "night" ? "text-white" : "text-dark"}`}>Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div style={backgroundStyle}>
        <div className="container">
          <div className="alert alert-danger text-center">Package not found</div>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="container">
        {/* Back Button */}
        <button
          className="btn btn-outline-primary mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="row">
          {/* Left Column - Images */}
          <div className="col-lg-6 mb-4">
            <div className={`card shadow-lg border-0 ${theme === "night" ? "bg-dark text-light" : ""}`}>
              {/* Main Image */}
              {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={pkg.imageUrls[currentImageIndex]}
                    alt={pkg.title}
                    className="card-img-top"
                    style={{ height: "400px", objectFit: "cover" }}
                  />

                  {/* Image Navigation */}
                  {pkg.imageUrls.length > 1 && (
                    <>
                      <button
                        className="btn btn-light"
                        onClick={prevImage}
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 10,
                        }}
                        disabled={currentImageIndex === 0}
                      >
                        ◀
                      </button>
                      <button
                        className="btn btn-light"
                        onClick={nextImage}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 10,
                        }}
                        disabled={currentImageIndex === pkg.imageUrls.length - 1}
                      >
                        ▶
                      </button>

                      {/* Image Counter */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {currentImageIndex + 1} / {pkg.imageUrls.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className="bg-secondary"
                  style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <span className="text-white">No Images Available</span>
                </div>
              )}

              {/* Thumbnail Gallery */}
              {pkg.imageUrls && pkg.imageUrls.length > 1 && (
                <div className="card-body p-2">
                  <div className="d-flex gap-2" style={{ overflowX: "auto" }}>
                    {pkg.imageUrls.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        style={{
                          height: "80px",
                          width: "80px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          cursor: "pointer",
                          border: currentImageIndex === idx ? "3px solid blue" : "none",
                          opacity: currentImageIndex === idx ? 1 : 0.6,
                        }}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="col-lg-6">
            <div className={`card shadow-lg border-0 h-100 ${theme === "night" ? "bg-dark text-light" : ""}`}>
              <div className="card-body">
                {/* Title */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h1 className="card-title fw-bold mb-0">{pkg.title}</h1>
                  <span className="badge bg-success">✓ APPROVED</span>
                </div>

                {/* Destination */}
                {pkg.destination && (
                  <p className={`${theme === "night" ? "text-light" : "text-muted"} mb-2`}>
                    <strong>📍 Destination:</strong> {pkg.destination}
                  </p>
                )}

                {/* Duration */}
                {pkg.duration && (
                  <p className={`${theme === "night" ? "text-light" : "text-muted"} mb-2`}>
                    <strong>⏱️ Duration:</strong> {pkg.duration}
                  </p>
                )}

                {/* Price */}
                <h3 className={`${theme === "night" ? "text-warning" : "text-primary"} mb-4`}>
                  ₹ {parseFloat(pkg.price).toLocaleString("en-IN")}
                </h3>

                {/* Description */}
                <div className={`mb-4 pb-3 border-bottom ${theme === "night" ? "border-secondary" : ""}`}>
                  <h5 className="fw-bold mb-2">About this package</h5>
                  <p className={`${theme === "night" ? "text-light" : "text-muted"} lh-lg`}>
                    {pkg.description}
                  </p>
                </div>

                {/* Package Highlights */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">📋 Package Highlights</h5>
                  <ul className={`${theme === "night" ? "text-light" : "text-muted"}`}>
                    <li>Professional guides and support</li>
                    <li>Comfortable accommodation</li>
                    <li>All major attractions included</li>
                    <li>Safe and secure travel</li>
                    <li>24/7 customer support</li>
                  </ul>
                </div>

                {/* Book Now Button */}
                <button
                  className="btn btn-primary btn-lg w-100 fw-bold shadow-lg"
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Processing...
                    </>
                  ) : (
                    "🎫 Book Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
