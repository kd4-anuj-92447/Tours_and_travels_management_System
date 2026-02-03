import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getApprovedPackagesApi } from "../api/customerApi";
import { createBookingApi } from "../api/bookingApi";

const CustomerCustomizeBooking = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tourStartDate, setTourStartDate] = useState("");
  const [touristsCount, setTouristsCount] = useState(1);

  useEffect(() => {
    loadPackage();
  }, [packageId]);

  const loadPackage = async () => {
    try {
      setLoading(true);

      const res = await getApprovedPackagesApi();
      const list = Array.isArray(res.data) ? res.data : [];

      const selected = list.find(
        (p) => p.id === parseInt(packageId)
      );

      if (!selected) {
        toast.error("Package not found");
        navigate("/customer/packages");
        return;
      }

      setPkg(selected);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load package");
      navigate("/customer/packages");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!tourStartDate) {
      toast.error("Please select tour date");
      return;
    }

    if (!touristsCount || touristsCount < 1) {
      toast.error("Number of tourists must be at least 1");
      return;
    }

    try {
      setSaving(true);

      /*
        IMPORTANT
        Your backend expects a Long package id
        (not { tourPackage : { id } })
      */
      const payload = {
        tourPackage: { id: Number(packageId) },
        tourStartDate: tourStartDate,
        touristsCount: touristsCount,
      };

      const res = await createBookingApi(payload);

      const bookingId =
        res.data?.id || res.data?.bookingId;

      toast.success("Booking created successfully");

      navigate(`/customer/payment/${bookingId}`);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create booking"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "650px" }}>
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card shadow border-0">
        <div className="card-body p-4">

          <h3 className="fw-bold mb-1">
            Customize your trip
          </h3>

          <p className="text-muted mb-4">
            {pkg.title}
          </p>

          {pkg.tourStartTime && pkg.tourEndTime && (
            <div className="alert alert-info py-2">
              <strong>Tour window:</strong>{" "}
              {new Date(pkg.tourStartTime).toLocaleString()} –{" "}
              {new Date(pkg.tourEndTime).toLocaleString()}
            </div>
          )}

          {/* Tour date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Select tour date
            </label>
            <input
              type="date"
              className="form-control"
              value={tourStartDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setTourStartDate(e.target.value)
              }
            />
          </div>

          {/* Tourists */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Number of tourists
            </label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={touristsCount}
              onChange={(e) =>
                setTouristsCount(Number(e.target.value))
              }
            />
          </div>

          <div className="d-grid">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirmBooking}
              disabled={saving}
            >
              {saving ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerCustomizeBooking;
