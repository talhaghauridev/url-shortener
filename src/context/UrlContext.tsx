"use client";

import { getUser } from "@/lib/actions/user.actions";
import { AuthSession } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UrlContextType = {
  user: AuthSession["user"] | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => void;
  isAuthenticated: boolean;
};

const UrlContext = createContext<UrlContextType | undefined>(undefined);

const useUrlContext = (): UrlContextType => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error("useUrlContext must be used within a UrlProvider");
  }
  return context;
};

// Custom hook to manage user state
const useUser = () => {
  const [user, setUser] = useState<AuthSession["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUser();
      setUser(res);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const isAuthenticated = useMemo(
    () => user?.role === "authenticated",
    [user?.role]
  );

  return { user, loading, error, fetchUser, isAuthenticated };
};

const UrlProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, error, fetchUser, isAuthenticated } = useUser();

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      fetchUser,
      isAuthenticated,
    }),
    [user, loading, error, fetchUser, isAuthenticated]
  );

  return (
    <UrlContext.Provider value={contextValue}>{children}</UrlContext.Provider>
  );
};

export { UrlProvider, useUrlContext };
