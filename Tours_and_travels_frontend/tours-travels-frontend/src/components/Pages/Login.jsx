import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(`/${role}`);
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center">Login</h3>

      <input className="form-control mb-2" placeholder="Email" />
      <input type="password" className="form-control mb-3" placeholder="Password" />

      <select className="form-control mb-3" onChange={e => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="agent">Agent</option>
        <option value="admin">Admin</option>
      </select>

      <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>

      <p className="text-center mt-2">
        New user? <a href="/register">Register</a>
      </p>
    </div>
  );
}
