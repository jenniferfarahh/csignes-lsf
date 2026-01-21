import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
};

type AuthContextValue = {
  accessToken: string | null;
  user: User | null;
  isLoadingUser: boolean;
  setAccessToken: (t: string | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const setAccessToken = (t: string | null) => {
    setAccessTokenState(t);
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");
  };
  // This function updates the token in state and localStorage.

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };
  // This function logs the user out by clearing token and user.

  const refreshUser = async () => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    setIsLoadingUser(true);
    try {
      const res = await fetch("http://localhost:3001/api/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        // token invalid/expired -> force logout
        logout();
        return;
      }

      const data = (await res.json()) as User;
      setUser(data);
    } finally {
      setIsLoadingUser(false);
    }
  };
  // This function fetches the logged-in user's profile from the backend.

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const value = useMemo(
    () => ({ accessToken, user, isLoadingUser, setAccessToken, logout, refreshUser }),
    [accessToken, user, isLoadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
