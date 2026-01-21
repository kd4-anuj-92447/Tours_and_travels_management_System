import { Link } from "react-router-dom";

export default function Navbar({ role }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Tours & Travels</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">

          {role === "customer" && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/customer">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/customer/packages">Packages</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/customer/bookings">Bookings</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/customer/profile">My Profile</Link></li>
            </>
          )}

          {role === "agent" && (
            <li className="nav-item"><Link className="nav-link" to="/agent">Dashboard</Link></li>
          )}

          {role === "admin" && (
            <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>
          )}

          <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
        </ul>

        <Link className="btn btn-outline-light" to="/logout">Logout</Link>
      </div>
    </nav>
  );
}
