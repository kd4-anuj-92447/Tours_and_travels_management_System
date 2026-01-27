import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { loginApi } from "../api/authApi";
import { saveAuthData, getRedirectPathByRole } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1503803919419-5f4a06a6d9cf?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleLogin = async (e) => {
  e.preventDefault(); // PREVENT FORM SUBMIT RELOAD

  try {
    const res = await loginApi(email, password);

    // Save token + role (unchanged logic)
    saveAuthData(res.data);

    toast.success("Login successful", { autoClose: 1000 });

    //  SAFETY: normalize role
    const role = res.data.role?.toUpperCase();

    //  SAFETY: fallback redirect
    const redirectPath = getRedirectPathByRole(role) || "/";

    navigate(redirectPath, { replace: true });

  } catch (error) {
    toast.error("Invalid email or password", { autoClose: 1000 });
  }
};

  return (
    <div style={backgroundStyle}>
      <div className="card p-4" style={{ width: "380px", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "10px" }}>
        <h4 className="text-center mb-3">Login</h4>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="text-center mt-3">
          <span>Don’t have an account? </span>
          <Link to="/register">Register as Customer</Link>
        </div>

        <hr />

        {/* AGENT REGISTRATION */}
        <div className="text-center mb-3">
          <span className="text-muted">Are you a travel agent? </span>
          <Link to="/agent-register" className="fw-bold">
            Register here
          </Link>
        </div>

        {/* OPTIONAL INFO */}
        <p className="text-muted text-center mt-2" style={{ fontSize: "13px" }}>
          Admins login using system-provided credentials.
        </p>
      </div>
    </div>
  );
};

export default Login;
