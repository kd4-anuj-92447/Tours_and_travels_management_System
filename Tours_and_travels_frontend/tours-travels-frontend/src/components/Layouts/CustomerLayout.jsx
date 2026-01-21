import { Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";

import CustomerHome from "../Customer/CustomerHome";
import Packages from "../customer/Packages";
import BookingHistory from "../customer/BookingHistory";
import Payment from "../customer/Payment";
import MyProfile from "../customer/MyProfile";

export default function CustomerLayout() {
  return (
    <>
      <Navbar role="customer" />
      <Routes>
        <Route index element={<CustomerHome />} />
        <Route path="packages" element={<Packages />} />
        <Route path="bookings" element={<BookingHistory />} />
        <Route path="payment" element={<Payment />} />
        <Route path="profile" element={<MyProfile />} />
      </Routes>
    </>
  );
}
