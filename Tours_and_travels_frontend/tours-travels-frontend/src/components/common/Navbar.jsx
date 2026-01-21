import { Link } from "react-router-dom";
import { getUser } from "../../utils/auth";

const Navbar = () => {
  const user = getUser();

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">Tours & Travels</Link>
        <div>
          {!user && (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
              <Link className="btn btn-outline-light" to="/register">Register</Link>
            </>
          )}
          {user && (
            <Link className="btn btn-danger" to="/logout">Logout</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
