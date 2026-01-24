import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPendingPackagesApi,
  getAllBookingsAdminApi,
  getAllPaymentsApi,
  getAllUsersApi,
} from "../api/adminApi";

import { getUserRole, logout } from "../utils/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [pendingPackages, setPendingPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 🔐 Role verification
    const role = getUserRole();
    if (role !== "ADMIN") {
      navigate("/unauthorized");
      return;
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        pendingPkgRes,
        bookingRes,
        paymentRes,
        userRes,
      ] = await Promise.all([
        getPendingPackagesApi(),
        getAllBookingsAdminApi(),
        getAllPaymentsApi(),
        getAllUsersApi(),
      ]);

      setPendingPackages(pendingPkgRes.data);
      setBookings(bookingRes.data);
      setPayments(paymentRes.data);
      setUsers(userRes.data);

    } catch (error) {
      console.error("Failed to load admin dashboard data", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Admin Dashboard</h3>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Pending Packages</h6>
              <h2>{pendingPackages.length}</h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin/packages")}
              >
                Verify Packages
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Bookings</h6>
              <h2>{bookings.length}</h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin/bookings")}
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Payments</h6>
              <h2>{payments.length}</h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin/payments")}
              >
                View Payments
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Users</h6>
              <h2>{users.length}</h2>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin/users")}
              >
                View Users
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
