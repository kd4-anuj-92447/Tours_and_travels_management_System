import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

/**
 * Protects routes by authentication and role
 * @param {ReactNode} children
 * @param {string[]} allowedRoles
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  // Not logged in
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
