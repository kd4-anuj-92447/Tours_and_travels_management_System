import { Outlet, useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "240px", padding: "20px", borderRight: "1px solid #ccc" }}>
        <h3>Agent Dashboard</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => navigate("/agent/packages")}>
            My Packages
          </button>

          <button onClick={() => navigate("/agent/packages/create")}>
            Create Package
          </button>

          <button onClick={() => navigate("/agent/bookings")}>
            Bookings
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AgentDashboard;
