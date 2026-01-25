import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h4>Logging out...</h4>
    </div>
  );
};

export default Logout;
