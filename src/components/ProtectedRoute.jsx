import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    // If role mismatch, send user to their dashboard
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
}
