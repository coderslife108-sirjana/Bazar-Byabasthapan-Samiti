
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = user.role === "staff" ? "noticeManager" : user.role;

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
