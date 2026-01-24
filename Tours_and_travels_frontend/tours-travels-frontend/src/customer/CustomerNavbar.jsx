import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/customer/packages", { state: { search: query } });
    setQuery("");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1050
      }}
    >
      <span
        className="navbar-brand fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/customer")}
      >
        Tours & Travels
      </span>

      {/* SEARCH BAR */}
      <form className="d-flex mx-auto" onSubmit={handleSearch}>
        <input
          className="form-control form-control-sm me-2"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline-light btn-sm">
          Search
        </button>
      </form>

      {/* ACTION BUTTONS */}
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/customer/packages")}
        >
          Browse Packages
        </button>

        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/customer/my-bookings")}
        >
          My Bookings
        </button>

        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/customer/profile")}
        >
          My Profile
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
