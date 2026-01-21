import { useNavigate } from "react-router-dom";
import TourCard from "../components/cards/TourCard";

const Tours = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2>Available Tours</h2>
      <TourCard />
      <button className="btn btn-primary mt-3" onClick={() => navigate("/tour/1")}>
        View Details
      </button>
    </div>
  );
};

export default Tours;
