import { useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Tours & Travels
        </span>

        <div className="ms-auto d-flex gap-2">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn btn-warning btn-sm fw-bold"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
