import { useLocation, useNavigate } from "react-router-dom";

const ConfirmBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pkg = state?.pkg;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h4>Confirm Booking</h4>
        <p>{pkg.title}</p>
        <p>₹{pkg.price}</p>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/customer/payment", { state: { pkg } })}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
