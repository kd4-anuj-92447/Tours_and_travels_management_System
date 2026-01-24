import { useLocation, useNavigate } from "react-router-dom";
import { createBookingApi } from "../api/bookingApi";
import { createPaymentApi } from "../api/paymentApi";
import { toast } from "react-toastify";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pkg = state?.pkg;

  const payNow = async () => {
    const booking = await createBookingApi(pkg.packageId);
    await createPaymentApi({
      bookingId: booking.data.bookingId,
      amount: pkg.price,
      paymentMode: "CARD"
    });

    toast.success("Booking Successful");
    navigate("/customer/my-bookings");
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-success" onClick={payNow}>
        Pay ₹{pkg.price}
      </button>
    </div>
  );
};

export default Payment;
