import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children, allowed = [] }) {
  const { user, loading, profile } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowed.length > 0 && !allowed.includes(profile?.role || "member")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
