import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

type AuthValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, phone: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  loading: true,
  signIn: async () => "Supabase is not configured.",
  signUp: async () => "Supabase is not configured.",
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return "Supabase is not configured.";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  const signUp = async (email: string, password: string, phone: string) => {
    if (!supabase) return "Supabase is not configured.";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { phone } },
    });
    if (error) return error.message;
    if (data.session) return null;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError?.message.toLowerCase().includes("confirm")) {
      return "Email confirmation is still on in Supabase, so this account cannot sign in yet. Turn off Confirm email under Authentication, then register again.";
    }
    return signInError?.message ?? null;
  };

  const signOut = async () => {
    await supabase?.auth.signOut({ scope: "local" });
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
