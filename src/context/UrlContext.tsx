"use client";
import { getUser } from "@/lib/actions/user.actions";
import { AuthSession } from "@supabase/supabase-js";
import { useAction } from "next-safe-action/hooks";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

type UrlContextType = {
  user: AuthSession["user"] | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
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

const useUser = () => {
  const initial = useRef(false);
  const { executeAsync, result: data, isExecuting } = useAction(getUser);

  const fetchUser = () => {
    executeAsync({});
    console.log("Hello World");
  };
  useEffect(() => {
    if (initial.current === false) {
      fetchUser();
      initial.current = true;
    }
  }, [initial]);

  const isAuthenticated = useMemo(
    () => data.data?.role === "authenticated",
    [data.data?.role]
  );

  return { user: data.data!, loading: isExecuting, fetchUser, isAuthenticated };
};

const UrlProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, fetchUser, isAuthenticated } = useUser();

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      fetchUser,
      isAuthenticated,
    }),
    [user, loading, fetchUser, isAuthenticated]
  );

  return (
    <UrlContext.Provider value={contextValue}>{children}</UrlContext.Provider>
  );
};

export { UrlProvider, useUrlContext };
