import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { fetchMe, login } from "../services/admin/admin.service";
import { UNAUTHORIZED_EVENT } from "../services/admin/adminApi";
import { clearToken, getToken, setToken } from "../services/admin/tokenStorage";

/** Admin session for the CRM. Verifies a stored token with the API on load. */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (getToken() ? "checking" : "signedOut"));

  useEffect(() => {
    if (status !== "checking") return;
    let cancelled = false;
    fetchMe()
      .then(({ user: me }) => {
        if (cancelled) return;
        setUser(me);
        setStatus("signedIn");
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setStatus("signedOut");
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setStatus("signedOut");
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const signIn = useCallback(async (username, password) => {
    const { token, user: me } = await login(username, password);
    setToken(token);
    setUser(me);
    setStatus("signedIn");
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("signedOut");
  }, []);

  /** After a password change the API issues a fresh token. */
  const updateSession = useCallback(({ token, user: me }) => {
    setToken(token);
    setUser(me);
  }, []);

  const value = useMemo(
    () => ({ user, status, signIn, signOut, updateSession }),
    [user, status, signIn, signOut, updateSession],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
