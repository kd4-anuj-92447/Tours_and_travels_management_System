import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Optional: clear session storage
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2>Logging out...</h2>
      <p>Please wait while we securely log you out.</p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default Logout;
