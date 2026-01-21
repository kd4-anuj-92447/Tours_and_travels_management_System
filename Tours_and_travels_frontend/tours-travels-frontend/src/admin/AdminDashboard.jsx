import { Link } from "react-router-dom";

const AdminDashboard = () => (
  <div className="container mt-4">
    <h2>Admin Dashboard</h2>
    <Link className="btn btn-primary me-2" to="/admin/tours">Manage Tours</Link>
    <Link className="btn btn-secondary me-2" to="/admin/bookings">Bookings</Link>
    <Link className="btn btn-warning" to="/admin/users">Users</Link>
  </div>
);

export default AdminDashboard;
