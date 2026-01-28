import { useState, useEffect , useRef} from "react";
import { toast } from "react-toastify";
import { getAgentRegistrationsApi, approveAgentApi, rejectAgentApi } from "../api/adminApi";

const ManageAgentRegistrations = () => {
  const [pendingAgents, setPendingAgents] = useState([]);
  const [approvedAgents, setApprovedAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

   /**
   * useRef used to prevent
   * double API calls & duplicate toasts
   * (especially in React Strict Mode)
   */
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await getAgentRegistrationsApi();
      const agents = response.data || [];

      setPendingAgents(agents.filter((a) => !a.isApproved));
      setApprovedAgents(agents.filter((a) => a.isApproved));
    } catch (error) {
      toast.error("Failed to fetch agent registrations", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agentId, agentEmail) => {
    try {
      console.log("📤 Approving agent:", agentId);
      await approveAgentApi(agentId);
      toast.success(`✓ Agent ${agentEmail} approved!`, { autoClose: 1000 });
      fetchAgents();
    } catch (error) {
      console.error("❌ Approval error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to approve agent";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  const handleReject = async (agentId, agentEmail) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      await rejectAgentApi(agentId, reason);
      toast.success(`✓ Agent ${agentEmail} rejected!`, { autoClose: 1000 });
      fetchAgents();
    } catch (error) {
      toast.error("Failed to reject agent", { autoClose: 1000 });
    }
  };
   // agent info card 
  const AgentCard = ({ agent, isPending }) => (
    <div className="card mb-3 p-3 border-left-2">
      <div className="row">
        <div className="col-md-8">
          <h5>{agent.name}</h5>
          <p className="mb-1">
            <strong>Email:</strong> {agent.email}
          </p>
          <p className="mb-1">
            <strong>Phone:</strong> {agent.phone}
          </p>
          <p className="mb-1">
            <strong>Company:</strong> {agent.companyName}
          </p>
          <p className="mb-1">
            <strong>License:</strong> {agent.licenseNumber}
          </p>
          <p className="mb-0">
            <strong>Address:</strong> {agent.address}
          </p>
        </div>
        <div className="col-md-4 d-flex flex-column justify-content-center gap-2">
          {isPending ? (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleApprove(agent.userId, agent.email)}
              >
                ✓ Approve
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleReject(agent.userId, agent.email)}
              >
                ✗ Reject
              </button>
            </>
          ) : (
            <span className="badge bg-success">Approved</span>
          )}
        </div>
      </div>
    </div>
  );
  // Show loader while data is loading
n 
  if (loading) {
    return <div className="text-center p-4">Loading agent registrations...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manage Agent Registrations</h3>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({pendingAgents.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved ({approvedAgents.length})
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "pending" && (
          <div>
            {pendingAgents.length === 0 ? (
              <p className="text-muted">No pending agent registrations</p>
            ) : (
              pendingAgents.map((agent) => (
                <AgentCard key={agent.userId} agent={agent} isPending={true} />
              ))
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div>
            {approvedAgents.length === 0 ? (
              <p className="text-muted">No approved agents</p>
            ) : (
              approvedAgents.map((agent) => (
                <AgentCard key={agent.userId} agent={agent} isPending={false} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAgentRegistrations;
