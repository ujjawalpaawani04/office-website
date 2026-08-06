import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchCurrentAdmin, login as loginRequest, logout as logoutRequest } from "../api/authApi";
import { registerSessionExpiredHandler, scheduleProactiveRefresh, silentRefresh } from "../api/adminClient";
import { useToast } from "../toast/useToast";
import { AuthContext } from "./authContext";
import { clearAccessToken, setAccessToken } from "./tokenStore";
import { useIdleTimeout } from "./useIdleTimeout";

// 30 minutes: reasonable default for a low-concurrency internal tool
// (see SRS Assumption A-03) rather than a public-facing product. Single
// tunable constant so it's never a magic number scattered across files.
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// How long before the idle logout to warn the user, giving them a chance
// to move the mouse/click and stay signed in instead of losing unsaved work.
const IDLE_WARNING_MS = 60 * 1000;

export function AuthProvider({ children }) {
  // "idle": haven't checked yet · "loading": checking/restoring session
  // "authenticated" | "unauthenticated"
  const [status, setStatus] = useState("idle");
  const [admin, setAdmin] = useState(null);
  const refreshTimerRef = useRef(null);
  const { showToast } = useToast();

  const clearScheduledRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const handleSessionEnd = useCallback(() => {
    clearScheduledRefresh();
    clearAccessToken();
    setAdmin(null);
    setStatus("unauthenticated");
  }, [clearScheduledRefresh]);

  // Wired into adminFetch/adminClient so any 401 that survives a refresh
  // attempt anywhere in the app (not just from this component) logs the
  // user out consistently.
  useEffect(() => {
    registerSessionExpiredHandler(handleSessionEnd);
  }, [handleSessionEnd]);

  // On first mount, try to restore a session from the httpOnly refresh
  // cookie - this is what makes a session survive a page reload or the
  // browser being closed and reopened, without any "remember me" checkbox.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      const token = await silentRefresh();
      if (cancelled) return;
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const me = await fetchCurrentAdmin();
        if (cancelled) return;
        setAdmin(me);
        setStatus("authenticated");
        refreshTimerRef.current = scheduleProactiveRefresh();
      } catch {
        if (!cancelled) handleSessionEnd();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email, password) => {
      const result = await loginRequest(email, password);
      setAccessToken(result.accessToken);
      setAdmin(result.admin);
      setStatus("authenticated");
      clearScheduledRefresh();
      refreshTimerRef.current = scheduleProactiveRefresh();
      return result.admin;
    },
    [clearScheduledRefresh]
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    handleSessionEnd();
  }, [handleSessionEnd]);

  // Lets Profile reflect a saved name change immediately (e.g. in the
  // Topbar) without a full page reload - called with whatever the save
  // endpoint's response already returned, no extra fetch needed.
  const updateAdminInfo = useCallback((patch) => {
    setAdmin((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const warnIdleLogout = useCallback(() => {
    showToast("You'll be signed out in 1 minute due to inactivity. Move your mouse or press any key to stay signed in.", "warning");
  }, [showToast]);

  useIdleTimeout(IDLE_TIMEOUT_MS, logout, status === "authenticated", {
    warningMs: IDLE_WARNING_MS,
    onWarning: warnIdleLogout,
  });

  const value = useMemo(
    () => ({ status, admin, login, logout, updateAdminInfo }),
    [status, admin, login, logout, updateAdminInfo]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
