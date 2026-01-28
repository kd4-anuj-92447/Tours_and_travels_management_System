import { useEffect, useState, useRef} from "react";
import {
  getAllPackagesAdminApi,
  approvePackageApi,
  rejectPackageApi,
  approveDeletePackageAdminApi,
} from "../api/adminApi";
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

const ManageAdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const hasLoaded = useRef(false);
  useEffect(() => {
     if (hasLoaded.current) return;
  hasLoaded.current = true;
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await getAllPackagesAdminApi();
      setPackages(res.data);
    } catch (err) {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */

  const approvePackage = async (id) => {
    try {
      setLoading(true);
      await approvePackageApi(id);
      toast.success("Package approved");
      await loadPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve package");
    } finally {
      setLoading(false);
    }
  };

  const rejectPackage = async (id) => {
    try {
      setLoading(true);
      await rejectPackageApi(id);
      toast.warning("Package rejected");
      await loadPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject package");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = (id) => {
    setConfirmDelete(id);
    toast.info("Confirm permanent deletion?", {
      position: "top-center",
      autoClose: false,
    });
  };

  const confirmDeletePackage = async (id) => {
    try {
      setLoading(true);
      await approveDeletePackageAdminApi(id);
      toast.success("Package deleted");
      setConfirmDelete(null);
      await loadPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete package");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manage Tour Packages</h3>

      {loading && <p>Loading packages...</p>}

      {!loading && packages.length === 0 && (
        <p className="text-muted">No packages found.</p>
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Agent</th>
            <th>Price</th>
            <th>Status</th>
            <th width="220">Actions</th>
          </tr>
        </thead>

        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.title}</td>
              <td>{pkg.agentName}</td>
              <td>₹ {pkg.price}</td>
              <td>
                <StatusBadge status={pkg.status} />
              </td>

              <td>
                {pkg.status === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approvePackage(pkg.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectPackage(pkg.id)}
                    >
                      Reject
                    </button>
                  </>
                )}

                {pkg.status === "PENDING_DELETE" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    Confirm Delete
                  </button>
                )}

                {(pkg.status === "APPROVED" ||
                  pkg.status === "REJECTED") && (
                  <span className="text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAdminPackages;
