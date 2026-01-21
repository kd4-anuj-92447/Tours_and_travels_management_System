import Navbar from "../Navbar";
import AdminDashboard from "../Dashboard/AdminDashboard";

export default function AdminLayout() {
  return (
    <>
      <Navbar role="admin" />
      <AdminDashboard />
    </>
  );
}
