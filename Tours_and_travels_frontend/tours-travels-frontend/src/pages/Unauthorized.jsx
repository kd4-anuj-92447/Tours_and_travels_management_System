import { Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
const Unauthorized = () => {
  useEffect(() => {
    toast.error("You are not authorized to access this page", { autoClose: 1000 });
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">403 – Unauthorized</h1>
      <p className="mt-3">
        You do not have permission to access this page.
      </p>

      <Link to="/login" className="btn btn-primary mt-3">
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
