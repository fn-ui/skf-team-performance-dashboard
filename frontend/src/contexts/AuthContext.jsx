import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async (
    userId
  ) => {
    if (!userId) return null;

    const { data, error } =
      await supabase
        .from("profiles")
        .select(`
            id,
            role,
            full_name,
            email,
            manager_id,

            member_details (
              avatar_url
            )
          `)
        .eq("id", userId)
        .maybeSingle();

    if (error) {
      console.error(
        "PROFILE FETCH ERROR:",
        error.message
      );

      return null;
    }
          const details = Array.isArray(
        data?.member_details
      )
        ? data.member_details[0]
        : data?.member_details;

      return {
        ...data,
        avatar_url:
          details?.avatar_url || "",
      };

    return data || null;
  };

  /* ================= WAIT FOR PROFILE ================= */

  const waitForProfile =
    async (
      userId,
      retries = 10
    ) => {
      for (
        let i = 0;
        i < retries;
        i++
      ) {
        const profileData =
          await fetchProfile(
            userId
          );

        if (profileData) {
          return profileData;
        }

        console.log(
          `WAITING FOR PROFILE ${
            i + 1
          }/${retries}`
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );
      }

      return null;
    };

  /* ================= LOAD USER ================= */

  const loadUser =
    async (session) => {
      const currentUser =
        session?.user || null;

      /* NO SESSION */

      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);

        return;
      }

      setUser(currentUser);

      /* WAIT FOR PROFILE */

      const profileData =
        await waitForProfile(
          currentUser.id
        );

      if (!profileData) {
        console.error(
          "PROFILE CREATION TIMEOUT"
        );

        setProfile(null);
        setLoading(false);

        return;
      }

      setProfile(profileData);

      setLoading(false);
    };

  /* ================= INIT ================= */

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);

        const {
          data,
          error,
        } =
          await supabase.auth.getSession();

        if (error) {
          console.error(
            error
          );

          setLoading(false);

          return;
        }

        if (!mounted) return;

        await loadUser(
          data.session
        );
      } catch (err) {
        console.error(err);

        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    init();

    /* ================= AUTH LISTENER ================= */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (
        event,
        session
      ) => {
        console.log(
          "AUTH EVENT:",
          event
        );

        if (!mounted) return;

        setLoading(true);

        await loadUser(session);
      }
    );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);

  /* ================= SIGN UP ================= */

  const signUp = async (
    email,
    password,
    role = "member",
    full_name = ""
  ) => {
    const {
      data,
      error,
    } =
      await supabase.auth.signUp({
        email: email
          .trim()
          .toLowerCase(),

        password:
          password.trim(),
      });

    if (error) {
      throw error;
    }

    if (data.user) {
      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .upsert([
          {
            id: data.user.id,

            email: email
              .trim()
              .toLowerCase(),

            role,

            full_name,

            last_seen:
              new Date().toISOString(),

            is_online: false,
          },
        ]);

      if (profileError) {
        console.error(
          profileError
        );

        throw profileError;
      }
    }

    return data;
  };

  /* ================= SIGN IN ================= */

  const signIn = async (
    email,
    password
  ) => {
    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email: email
            .trim()
            .toLowerCase(),

          password:
            password.trim(),
        }
      );

    if (error) {
      throw error;
    }

    return data;
  };

  /* ================= SIGN OUT ================= */

  const signOut = async () => {
    await supabase.auth.signOut();

    setUser(null);

    setProfile(null);
  };

  /* ================= CONTEXT ================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext
  );
}