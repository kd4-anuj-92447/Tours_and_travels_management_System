import { useLocation, useNavigate } from "react-router-dom";

const PackageDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pkg = state?.pkg;

  if (!pkg) return null;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3>{pkg.title}</h3>
        <p>{pkg.destination}</p>
        <p>{pkg.description}</p>

        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/customer/confirm-booking", { state: { pkg } })}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PackageDetails;
