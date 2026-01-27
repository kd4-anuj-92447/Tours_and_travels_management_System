import { useNavigate } from "react-router-dom";
import { useTheme } from "./CustomerThemeContext";
import { logout } from "../utils/auth";
import { useState } from "react";
import { searchPackagesApi } from "../api/customerApi";
import { toast } from "react-toastify";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.warning("Please enter a destination");
      return;
    }

    try {
      setLoading(true);
      
      // Try API first, fallback to client-side search
      let results = [];
      try {
        const res = await searchPackagesApi(query);
        results = Array.isArray(res.data) ? res.data : res.data?.data || [];
      } catch (apiErr) {
        // API failed, fallback to fetching all packages and filtering locally
        const { getApprovedPackagesApi } = await import("../api/customerApi");
        const res = await getApprovedPackagesApi();
        const allPackages = Array.isArray(res.data) ? res.data : [];
        
        // Filter by destination (primary search), title, and description
        results = allPackages.filter(pkg => 
          pkg.destination?.toLowerCase().includes(query.toLowerCase()) ||
          pkg.title?.toLowerCase().includes(query.toLowerCase()) ||
          pkg.description?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      navigate(`/customer/search-results`, { 
        state: { 
          results: results,
          query: query 
        } 
      });
      setQuery("");
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Failed to search packages");
    } finally {
      setLoading(false);
    }
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
            placeholder="Where you wanna Go??"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button 
            className="btn btn-sm btn-outline-light ms-2" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "🔍"}
          </button>
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
