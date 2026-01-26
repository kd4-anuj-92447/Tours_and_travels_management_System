import { useNavigate } from "react-router-dom";
import { useTheme } from "./CustomerThemeContext";
import { logout } from "../utils/auth";
import { useState } from "react";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/customer/packages?search=${query}`);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === "night" ? "navbar-dark bg-black" : "navbar-dark bg-primary"
      }`}
    >
      <div className="container-fluid px-4">

        {/* BRAND */}
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/customer/dashboard")}
        >
          Tours & Travels
        </span>

        {/* SEARCH */}
        <form className="d-flex ms-3 me-auto" onSubmit={handleSearch}>
          <input
            className="form-control form-control-sm"
            type="search"
            placeholder="Search packages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* NAV ITEMS */}
        <ul className="navbar-nav align-items-center">

          <li className="nav-item mx-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => navigate("/customer/dashboard")}
            >
              Dashboard
            </button>
          </li>

          <li className="nav-item mx-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => navigate("/customer/packages")}
            >
              Packages
            </button>
          </li>

          <li className="nav-item mx-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => navigate("/customer/bookings")}
            >
              My Bookings
            </button>
          </li>

          <li className="nav-item mx-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => navigate("/customer/profile")}
            >
              My Profile
            </button>
          </li>

          {/* 🌙 / 🌞 THEME TOGGLE */}
          <li className="nav-item mx-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              {theme === "day" ? "🌙 Night" : "🌞 Day"}
            </button>
          </li>

          {/* LOGOUT */}
          <li className="nav-item mx-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
