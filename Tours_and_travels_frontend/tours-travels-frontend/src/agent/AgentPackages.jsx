import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAgentPackagesApi, deletePackageApi } from "../api/agentApi";

const AgentPackages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const res = await getAgentPackagesApi();
    setPackages(res.data);
  };

  const handleDelete = async (packageId) => {
    await deletePackageApi(packageId);
    setPackages(prev => prev.filter(p => p.packageId !== packageId));
  };

  return (
    <div>
      <h3>My Packages</h3>

      <button onClick={() => navigate("/agent/packages/create")}>
        + Create New Package
      </button>

      {packages.length === 0 && <p>No packages created yet.</p>}

      {packages.map(p => (
        <div
          key={p.packageId}
          style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
        >
          <h4>{p.title}</h4>
          <p>Location: {p.location}</p>
          <p>Price: ₹{p.price}</p>
          <p>Duration: {p.durationDays} days</p>

          <button onClick={() => handleDelete(p.packageId)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AgentPackages;
