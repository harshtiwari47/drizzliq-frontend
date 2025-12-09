import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { request, setAccessToken, clearAccessToken } from "../api/fetchClient";

const AuthContext = createContext(null);

const REFRESH_ENDPOINT = "/auth/refresh";
const LOGIN_ENDPOINT = "/auth/login";
const SIGNUP_ENDPOINT = "/auth/signup";
const LOGOUT_ENDPOINT = "/auth/logout";
const ME_ENDPOINT = "/auth/me";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Silent refresh
  useEffect(() => {
    console.log("\n========== AUTH INIT (Silent Refresh) ==========");
    async function init() {
      setLoading(true);

      try {
        const res = await request(REFRESH_ENDPOINT, { method: "POST" });

        if (!res.ok) throw new Error("Silent refresh not OK");

        const data = await res.json();

        if (data.accessToken) {
          setAccessToken(data.accessToken);

          try {
            localStorage.setItem("access_token", data.accessToken);
          } catch (_) {}

          if (data.user) {
            setUser(data.user);
          } else {
            const me = await request(ME_ENDPOINT, { method: "GET" });
            if (!me.ok) {
              console.warn("[Auth] /me returned non-OK:", me.status);
              // do not set user; optionally logout or keep unauthenticated
              return;
            }
            const meData = await me.json();
            setUser(meData.user || meData);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        clearState();
      }

      setLoading(false);
    }

    init();
  }, [isAuthenticated]);

  const clearState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    clearAccessToken();
    try {
      localStorage.removeItem("access_token");
    } catch (_) {}
  }, []);

  const login = useCallback(async (email, password) => {
    const body = JSON.stringify({ email, password });

    const res = await request(LOGIN_ENDPOINT, {
      method: "POST",
      body,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `Login failed: ${res.status}`);
    }

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      try {
        localStorage.setItem("access_token", data.accessToken);
      } catch (_) {}
    }

    setIsAuthenticated(true);
    return data?.user;
  }, []);

  const signup = useCallback(async (payload) => {
    const res = await request(SIGNUP_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) throw new Error(data?.message || "Signup failed");

    if (data.accessToken) {
      setAccessToken(data.accessToken);
      try {
        localStorage.setItem("access_token", data.accessToken);
      } catch (_) {}
    }

    return data?.data?.user;
  }, []);

  const logout = useCallback(async () => {
    await request(LOGOUT_ENDPOINT, { method: "POST" }).catch((err) =>
      console.error("[logout] Error:", err)
    );

    clearState();
  }, [clearState]);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
