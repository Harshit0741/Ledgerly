import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import * as authApi from "@/api/auth";
import { getToken, setToken } from "@/api/client";

const USER_KEY = "ledger.user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      
    }
    setTokenState(getToken());
    setReady(true);
  }, []);

  const persist = useCallback((nextUser, nextToken) => {
    setUser(nextUser || null);
    setToken(nextToken || null);
    setTokenState(nextToken || null);
    try {
      if (nextUser) window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      else window.localStorage.removeItem(USER_KEY);
    } catch {
     
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      persist(data.user, data.token);
      return data;
    },
    [persist],
  );

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      persist(data.user, data.token);
      return data;
    },
    [persist],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      
    }
    persist(null, null);
  }, [persist]);

  const value = useMemo(
    () => ({ user, token, ready, isAuthenticated: Boolean(user), login, register, logout }),
    [user, token, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
