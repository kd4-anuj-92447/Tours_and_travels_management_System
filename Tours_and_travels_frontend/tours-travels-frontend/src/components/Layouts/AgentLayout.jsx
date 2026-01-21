import Navbar from "../Navbar";
import AgentDashboard from "../Dashboard/AgentDashboard";

export default function AgentLayout() {
  return (
    <>
      <Navbar role="agent" />
      <AgentDashboard />
    </>
  );
}
