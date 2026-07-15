import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function useRoleRedirect() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user || !profile) return;

    const role = profile.role;

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "manager") {
      navigate("/manager");
    } else {
      navigate("/member");
    }
  }, [user, profile, loading, navigate]);
}
