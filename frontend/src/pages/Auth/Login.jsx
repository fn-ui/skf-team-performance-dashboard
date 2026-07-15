import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";

export default function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  const { signIn } = useAuth();

  const navigate = useNavigate();


  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      await signIn(
        email,
        password
      );


      navigate("/");

    } catch (err) {

      alert(
        err.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };


  const handleForgotPassword =
    async () => {

      try {

        if (!email) {

          alert(
            "Please enter your email first."
          );

          return;
        }

        setResetLoading(true);

        const { error } =
          await supabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo:
                "http://localhost:5173/reset-password",
            }
          );

        if (error) {
          throw error;
        }

        alert(
          "Password reset link sent to your email."
        );

      } catch (error) {

        alert(
          error.message ||
            "Failed to send reset email."
        );

      } finally {

        setResetLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-zinc-950">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">


        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">

            <Lock className="text-emerald-600" />

          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-500 dark:text-zinc-400">
            Sign in to continue to your dashboard
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">

              Email Address

            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
                required
              />

            </div>

          </div>


          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">

              Password

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
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-900/30"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-zinc-200"
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

          </div>


          <div className="flex justify-end">

            <button
              type="button"
              onClick={
                handleForgotPassword
              }
              disabled={
                resetLoading
              }
              className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline disabled:opacity-50"
            >

              {resetLoading
                ? "Sending reset link..."
                : "Forgot Password?"}

            </button>

          </div>


          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}

          </button>

        </form>

      </div>

    </div>
  );
}
