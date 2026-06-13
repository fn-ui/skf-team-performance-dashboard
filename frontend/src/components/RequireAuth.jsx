import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({
  children,
  allowed = [],
}) {
  const {
    user,
    loading,
    profile,
  } = useAuth();

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  /* ================= NOT AUTHENTICATED ================= */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* ================= FORCE PASSWORD CREATION ================= */

  const passwordCreated =
    user?.user_metadata
      ?.password_created;

  if (!passwordCreated) {
    return (
      <Navigate
        to="/update-password"
        replace
      />
    );
  }

  /* ================= PROFILE NOT READY ================= */

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Setting up your account...
      </div>
    );
  }

  /* ================= ROLE CHECK ================= */

  const role = profile.role;

  if (
    allowed.length > 0 &&
    !allowed.includes(role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* ================= ALLOWED ================= */

  return children;
}