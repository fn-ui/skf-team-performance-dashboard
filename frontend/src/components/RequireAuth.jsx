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


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


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


  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Setting up your account...
      </div>
    );
  }


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


  return children;
}
