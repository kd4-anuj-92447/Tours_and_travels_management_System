// React hooks for component lifecycle, state management, and refs
import { useEffect, useState, useRef } from "react";

// Agent-related API calls
import {
  getMyPackagesApi,
  deletePackageApi,
} from "../api/agentApi";

// Hook for navigation between routes
import { useNavigate } from "react-router-dom";

// Toast notifications for user feedback
import { toast } from "react-toastify";

/**
 * Reusable component to display package status
 * with appropriate Bootstrap badge color
 */
const StatusBadge = ({ status }) => {
  // Mapping of package status to Bootstrap color classes
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
  // Used for programmatic navigation
  const navigate = useNavigate();

  // State to store agent-created packages
  const [packages, setPackages] = useState([]);

  // Ref to prevent useEffect from running twice (React StrictMode safeguard)
  const hasLoaded = useRef(false);

  // Load packages once when component mounts
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    loadPackages();
  }, []);

  /**
   * Fetch all packages created by the logged-in agent
   */
  const loadPackages = async () => {
    try {
      const res = await getMyPackagesApi();
      setPackages(res.data);
    } catch (err) {
      toast.error("Failed to load packages");
    }
  };

  /**
   * Handles package deletion request
   * @param {number} id - Package ID
   */
  const requestDelete = async (id) => {
    // Debug log for delete action
    console.log("Delete clicked for package:", id);

    // Confirmation dialog before deletion
    if (
      !window.confirm(
        "This will permanently delete the package. Continue?"
      )
    ) {
      return;
    }

    try {
      // Call backend API to delete the package
      await deletePackageApi(id);

      // Show success message
      toast.success("Package deleted successfully");

      // Reload package list after deletion
      await loadPackages();
    } catch (error) {
      console.error("Delete error:", error);

      // Display backend error message if available
      toast.error(
        error.response?.data || "Failed to delete package"
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* Page header with create package button */}
      <div className="d-flex justify-content-between mb-3">
        <h3>My Packages</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/agent/create-package")}
        >
          + Create Package
        </button>
      </div>

      {/* Message when no packages exist */}
      {packages.length === 0 && (
        <p className="text-muted">No packages created yet.</p>
      )}

      {/* Packages table */}
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
                {/* Status badge component */}
                <StatusBadge status={pkg.status} />
              </td>
              <td>
                {/* Edit package button */}
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    navigate(`/agent/edit-package/${pkg.id}`)
                  }
                >
                  Edit
                </button>

                {/* Delete button hidden if deletion already requested */}
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

// Export AgentPackages component
export default AgentPackages;
