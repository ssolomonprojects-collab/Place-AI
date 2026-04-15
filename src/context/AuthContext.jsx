import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkOnboarding(u);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkOnboarding(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboarding = (u) => {
    const isOAuth = u.app_metadata?.provider !== "email";
    const hasCollege = u.user_metadata?.college;
    setNeedsOnboarding(isOAuth && !hasCollege);
  };

  return (
    <AuthContext.Provider value={{ user, loading, needsOnboarding, setNeedsOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);