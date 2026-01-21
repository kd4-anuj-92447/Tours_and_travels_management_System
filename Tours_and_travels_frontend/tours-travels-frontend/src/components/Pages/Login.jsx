import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Later you will replace this with API + JWT
    navigate(`/${role}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3 className="text-center mb-3">Login</h3>

        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
        />

        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center mt-3">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
