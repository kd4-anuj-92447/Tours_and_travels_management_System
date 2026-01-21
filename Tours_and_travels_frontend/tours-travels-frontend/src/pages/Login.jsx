import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    loginUser(role === "ADMIN" ? "admin@tours.com" : "user@tours.com");
    navigate(role === "ADMIN" ? "/admin" : "/tours");
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <button className="btn btn-primary me-2" onClick={() => handleLogin("USER")}>
        Login as User
      </button>
      <button className="btn btn-dark" onClick={() => handleLogin("ADMIN")}>
        Login as Admin
      </button>
    </div>
  );
};

export default Login;
