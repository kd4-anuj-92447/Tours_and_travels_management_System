import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerAgentApi } from "../api/authApi";

const AgentRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px",
    paddingBottom: "20px",
  };

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !phone || !companyName || !licenseNumber || !address) {
      toast.error("Please fill all fields", { autoClose: 1000 });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", { autoClose: 1000 });
      return;
    }

    setLoading(true);
    try {
      await registerAgentApi({
        name,
        email,
        password,
        phone,
        companyName,
        licenseNumber,
        address,
      });

      toast.success("✓ Registration submitted! Awaiting admin approval.", { autoClose: 1500 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message, { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div
        className="card p-4"
        style={{
          width: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h4 className="text-center mb-2">Agent Registration</h4>
        <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Register your travel agency. Admin approval required.
        </p>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name *</label>
            <input
              className="form-control"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Company Name *</label>
          <input
            className="form-control"
            placeholder="Your travel agency name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">License Number *</label>
          <input
            className="form-control"
            placeholder="Travel agency license number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address *</label>
          <textarea
            className="form-control"
            placeholder="Office address"
            rows="2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success w-100 mb-3"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Submit Registration"}
        </button>

        <div className="text-center">
          <span>Already have an account? </span>
          <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default AgentRegister;
