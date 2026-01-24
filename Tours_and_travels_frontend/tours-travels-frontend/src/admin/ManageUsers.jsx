import { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus, updateUserRole } from "../api/adminApi";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const load = () =>
    getAllUsers().then(res => setUsers(res.data));

  useEffect(load, []);

  return (
    <div className="container mt-4">
      <h3>👥 Manage Users</h3>

      <table className="table table-striped table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>
                <span className={`badge bg-${u.active ? "success" : "secondary"}`}>
                  {u.active ? "Active" : "Blocked"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={async () => {
                    await updateUserStatus(u._id, !u.active);
                    toast.info("User status updated");
                    load();
                  }}
                >
                  Toggle
                </button>

                {u.role === "CUSTOMER" && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={async () => {
                      await updateUserRole(u._id, "AGENT");
                      toast.success("Promoted to Agent");
                      load();
                    }}
                  >
                    Make Agent
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
