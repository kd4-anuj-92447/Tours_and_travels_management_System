import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getUserRole, isAuthenticated, logout } from "../../utils/auth";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [role, setRole] = useState(getUserRole());
  const navigate = useNavigate();
  const navbarRef = useRef();

  useEffect(() => {
    const updateAuth = () => {
      setLoggedIn(isAuthenticated());
      setRole(getUserRole());
    };

    window.addEventListener("authChanged", updateAuth);
    return () => window.removeEventListener("authChanged", updateAuth);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    collapseNavbar();
  };

  const collapseNavbar = () => {
    if (navbarRef.current?.classList.contains("show")) {
      navbarRef.current.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={collapseNavbar}>
          Tours & Travels
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
          ref={navbarRef}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            {!loggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={collapseNavbar}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/register" onClick={collapseNavbar}>
                    Register
                  </Link>
                </li>
              </>
            )}

            {loggedIn && role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" onClick={collapseNavbar}>
                  Admin Dashboard
                </Link>
              </li>
            )}

            {loggedIn && role === "AGENT" && (
              <li className="nav-item">
                <Link className="nav-link" to="/agent" onClick={collapseNavbar}>
                  Agent Dashboard
                </Link>
              </li>
            )}

            {loggedIn && role === "CUSTOMER" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/packages" onClick={collapseNavbar}>
                    Packages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/my-bookings" onClick={collapseNavbar}>
                    My Bookings
                  </Link>
                </li>
              </>
            )}

            {loggedIn && (
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-danger ms-lg-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
