/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      setLoading(true);
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(currentUser ?? null);

      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", currentUser.id)
            .single();
          if (error) {
            console.error('Failed to fetch profile:', error);
            setProfile(null);
          } else {
            setProfile(data ?? null);
          }
        } catch (err) {
          console.error('Unexpected error fetching profile:', err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        (async () => {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role, full_name")
              .eq("id", session.user.id)
              .single();
            if (error) {
              console.error('Failed to fetch profile after sign in:', error);
              setProfile(null);
            } else {
              setProfile(data ?? null);
            }
          } catch (err) {
            console.error('Unexpected error fetching profile after sign in:', err);
            setProfile(null);
          }
        })();
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, role = "member", full_name = "") => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // create profile row with role (this requires a profiles table)
    if (data.user) {
      await supabase.from("profiles").insert([{ id: data.user.id, role, full_name }]);
    }

    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
