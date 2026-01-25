import { useEffect, useState } from "react";
import {
  getMyPackagesApi,
  deletePackageApi,
} from "../api/agentApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
    PENDING_DELETE: "secondary",
  };

  return (
    <span className={`badge bg-${map[status] || "dark"}`}>
      {status}
    </span>
  );
};

const AgentPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await getMyPackagesApi();
      setPackages(res.data);
    } catch (err) {
      toast.error("Failed to load packages");
    }
  };

  const requestDelete = async (id) => {
    if (!window.confirm("Request delete for this package?")) return;
    await deletePackageApi(id);
    toast.info("Delete request sent to admin");
    loadPackages();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>My Packages</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/agent/create-package")}
        >
          + Create Package
        </button>
      </div>

      {packages.length === 0 && (
        <p className="text-muted">No packages created yet.</p>
      )}

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th width="200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.title}</td>
              <td>₹ {pkg.price}</td>
              <td>
                <StatusBadge status={pkg.status} />
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    navigate(`/agent/edit-package/${pkg.id}`)
                  }
                >
                  Edit
                </button>

                {pkg.status !== "PENDING_DELETE" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => requestDelete(pkg.id)}
                  >
                    Delete
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

export default AgentPackages;
