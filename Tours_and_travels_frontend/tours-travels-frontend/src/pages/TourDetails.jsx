import { useNavigate } from "react-router-dom";

const TourDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2>Tour Details</h2>
      <button className="btn btn-success" onClick={() => navigate("/booking")}>
        Book Now
      </button>
    </div>
  );
};

export default TourDetails;
