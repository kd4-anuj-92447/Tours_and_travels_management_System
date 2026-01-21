import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import Profile from "../pages/MyProfile";
import NotFound from "../pages/NotFound";
import Logout from "../pages/Logout";
import AdminDashboard from "../admin/AdminDashboard";
import ManageTours from "../admin/ManageTours";
import ManageBookings from "../admin/ManageBookings";
import ManageUsers from "../admin/ManageUsers";

const AppRoutes = () => (
  <Routes>
    {/* Customer / Public */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/tours" element={<Tours />} />
    <Route path="/tour/:id" element={<TourDetails />} />
    <Route path="/booking" element={<Booking />} />
    <Route path="/my-bookings" element={<MyBookings />} />
    <Route path="/profile" element={<Profile />} />

    {/* Admin */}
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/tours" element={<ManageTours />} />
    <Route path="/admin/bookings" element={<ManageBookings />} />
    <Route path="/admin/users" element={<ManageUsers />} />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
    <Route path="/logout" element={<Logout />} />
  </Routes>
);

export default AppRoutes;
