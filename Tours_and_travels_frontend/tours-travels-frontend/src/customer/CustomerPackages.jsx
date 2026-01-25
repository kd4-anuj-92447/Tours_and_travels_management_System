import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CustomerNavbar from "./CustomerNavbar";
import { getApprovedPackagesApi } from "../api/customerApi";
import { createBookingApi } from "../api/bookingApi";

/* Status badge */
const StatusBadge = () => (
  <span className="badge bg-success">APPROVED</span>
);

const CustomerPackages = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await getApprovedPackagesApi();
      setPackages(res.data);
      setFilteredPackages(res.data);
    } catch (error) {
      toast.error("Failed to load packages", { autoClose: 2000 });
    }
  };

  /* 🔍 Search from navbar */
  const handleSearch = (query) => {
    if (!query) {
      setFilteredPackages(packages);
      return;
    }

    setFilteredPackages(
      packages.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query.toLowerCase()) ||
          pkg.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  /* ✅ BOOK NOW – CREATE BOOKING */
  const handleBookNow = async (packageId) => {
    try {
      setLoadingId(packageId);

      await createBookingApi(packageId);

      toast.success(
        "Booking request sent. Awaiting admin confirmation.",
        { autoClose: 2000 }
      );

      navigate("/customer/my-bookings");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You are not authorized", { autoClose: 2000 });
      } else {
        toast.error("Failed to create booking", { autoClose: 2000 });
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {/* Navbar with search */}
      <CustomerNavbar onSearch={handleSearch} />

      <div className="container mt-4">
        <h3 className="mb-4">Browse Tour Packages</h3>

        <div className="row">
          {filteredPackages.length === 0 && (
            <p className="text-muted">No packages found.</p>
          )}

          {filteredPackages.map((pkg) => (
            <div className="col-md-4 mb-4" key={pkg.id}>
              <div className="card shadow-sm h-100">

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

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{pkg.title}</h5>
                    <StatusBadge />
                  </div>

                  <p className="card-text text-muted">
                    {pkg.description.length > 90
                      ? pkg.description.substring(0, 90) + "..."
                      : pkg.description}
                  </p>

                  <p className="fw-bold mt-auto mb-3">
                    ₹ {pkg.price}
                  </p>

                  <button
                    className="btn btn-primary w-100"
                    disabled={loadingId === pkg.id}
                    onClick={() => handleBookNow(pkg.id)}
                  >
                    {loadingId === pkg.id
                      ? "Booking..."
                      : "Book Now"}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerPackages;
