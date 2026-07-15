import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

function UpdatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleUpdatePassword =
    async (e) => {
      e.preventDefault();

      setError("");


      if (password.length < 6) {
        setError(
          "Password must be at least 6 characters"
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match"
        );

        return;
      }

      try {
        setLoading(true);


        const {
          data,
          error,
        } =
          await supabase.auth.updateUser(
            {
              password,

              data: {
                password_created: true,
              },
            }
          );

        if (error) {
          setError(error.message);

          setLoading(false);

          return;
        }

        console.log(
          "PASSWORD UPDATED:",
          data
        );


        window.location.href =
          "/";
      } catch (err) {
        console.error(err);

        setError(
          "Something went wrong"
        );
      }

      setLoading(false);
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-zinc-950">
      <form
        onSubmit={
          handleUpdatePassword
        }
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900"
      >

        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
          Create Password
        </h1>

        <p className="mb-6 text-slate-500 dark:text-zinc-400">
          Finish setting up your
          WorkPulse account.
        </p>


        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}


        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            New Password
          </label>

          <input
            type="password"
            required
            minLength={6}
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>


        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Confirm Password
          </label>

          <input
            type="password"
            required
            minLength={6}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 p-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Saving Password..."
            : "Create Password"}
        </button>
      </form>
    </div>
  );
}

export default UpdatePassword;
