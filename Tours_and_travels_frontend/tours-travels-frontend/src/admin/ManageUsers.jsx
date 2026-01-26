import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsersApi } from "../api/adminApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersApi();
      console.log("Full response object:", res);
      console.log("Users response data:", res.data);
      // Handle both array and wrapped response
      const userData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      console.log("Processed user data:", userData);
      setUsers(userData);
      if (userData.length === 0) {
        console.warn("No users returned from API");
      }
    } catch (err) {
      console.error("Error loading users:", err);
      console.error("Error response status:", err.response?.status);
      console.error("Error response data:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to load users", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>All Users</h2>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role?.roleName || user.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
