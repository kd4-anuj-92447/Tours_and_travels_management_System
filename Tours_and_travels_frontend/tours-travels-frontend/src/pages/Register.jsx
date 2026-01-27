import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerCustomerApi } from "../api/authApi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleRegister = async () => {
    // Validate fields on frontend
    if (!name.trim()) {
      toast.error("Name is required", { autoClose: 1000 });
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required", { autoClose: 1000 });
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters", { autoClose: 1000 });
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone is required", { autoClose: 1000 });
      return;
    }

    // Prepare registration data
    const registrationData = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      phone: phone.trim(),
    };

    console.log("📤 Sending registration data:", registrationData);

    try {
      const response = await registerCustomerApi(registrationData);
      console.log("✅ Registration response:", response);

      toast.success("Registration successful. Please login.", { autoClose: 1000 });
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration error full:", error);
      console.error("Error response data:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <div style={backgroundStyle}>
      <div className="card p-4" style={{ width: "400px", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "10px" }}>
        <h4 className="text-center mb-4">Create Account</h4>

      <input
        className="form-control mb-3"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={handleRegister}>
        Register
      </button>

      <div className="text-center mt-3">
        <span>Already have an account? </span>
        <a href="/login">Login here</a>
      </div>
      </div>
    </div>
  );
};

export default Register;
