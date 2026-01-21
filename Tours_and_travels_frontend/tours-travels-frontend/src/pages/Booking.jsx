import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2>Booking Page</h2>
      <button className="btn btn-primary" onClick={() => navigate("/my-bookings")}>
        Confirm Booking
      </button>
    </div>
  );
};

export default Booking;
