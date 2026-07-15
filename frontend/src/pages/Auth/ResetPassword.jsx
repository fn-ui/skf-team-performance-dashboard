import { useState } from "react";

import { supabase } from "../../lib/supabase";

import { useNavigate } from "react-router-dom";

import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ResetPassword() {

  const navigate =
    useNavigate();

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      try {

        if (
          !password ||
          !confirmPassword
        ) {

          alert(
            "Please fill all fields."
          );

          return;
        }

        if (
          password !==
          confirmPassword
        ) {

          alert(
            "Passwords do not match."
          );

          return;
        }

        if (
          password.length < 6
        ) {

          alert(
            "Password must be at least 6 characters."
          );

          return;
        }

        setLoading(true);

        const { error } =
          await supabase.auth.updateUser(
            {
              password,
            }
          );

        if (error) {
          throw error;
        }

        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2500);

      } catch (error) {

        alert(
          error.message ||
            "Failed to reset password."
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-zinc-950">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">


        {success ? (

          <div className="text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">

              <CheckCircle2
                size={40}
                className="text-emerald-600"
              />

            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

              Password Updated

            </h1>

            <p className="mt-3 text-slate-500 dark:text-zinc-400">

              Your password has been reset successfully.

            </p>

            <p className="mt-2 text-sm text-slate-400">

              Redirecting to login...

            </p>

          </div>

        ) : (

          <>

            <div className="mb-8 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">

                <Lock className="text-emerald-600" />

              </div>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

                Reset Password

              </h1>

              <p className="mt-2 text-slate-500 dark:text-zinc-400">

                Enter your new password below

              </p>

            </div>


            <form
              onSubmit={
                handleResetPassword
              }
              className="space-y-5"
            >


              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">

                  New Password

                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">

                  Confirm Password

                </label>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}

              </button>

            </form>
          </>
        )}

      </div>

    </div>
  );
}
