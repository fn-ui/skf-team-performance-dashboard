import { useEffect } from "react";

import {
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const handleAuth =
      async () => {
        try {
          /* ================= EXCHANGE SESSION ================= */

          const {
            data,
            error,
          } =
            await supabase.auth.getSession();

          if (error) {
            console.error(
              "SESSION ERROR:",
              error
            );

            navigate("/login");

            return;
          }

          const session =
            data?.session;

          if (!session) {
            navigate("/login");

            return;
          }

          console.log(
            "INVITED USER SESSION:",
            session.user.email
          );

          /* ================= WAIT FOR PROFILE ================= */

          for (
            let i = 0;
            i < 10;
            i++
          ) {
            const {
              data: profile,
            } = await supabase
              .from("profiles")
              .select("id")
              .eq(
                "id",
                session.user.id
              )
              .maybeSingle();

            if (profile) {
              console.log(
                "PROFILE READY"
              );

              if (mounted) {
                navigate(
                  "/update-password"
                );
              }

              return;
            }

            console.log(
              `WAITING FOR PROFILE ${
                i + 1
              }/10`
            );

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  1000
                )
            );
          }

          console.error(
            "PROFILE CREATION TIMEOUT"
          );

          navigate("/login");
        } catch (err) {
          console.error(
            "AUTH CALLBACK ERROR:",
            err
          );

          navigate("/login");
        }
      };

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-zinc-950">
      <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Processing invitation...
        </h1>

        <p className="mt-2 text-slate-500 dark:text-zinc-400">
          Setting up your account.
        </p>
      </div>
    </div>
  );
}

export default AuthCallback;