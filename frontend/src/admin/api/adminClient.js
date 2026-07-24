// Admin-only fetch wrapper. Kept separate from ../../api/client.js
// (the public site's existing apiFetch) rather than modifying it - the
// public API layer is live, working, and must not change behavior; every
// admin call needs two extra things a public call never does: a Bearer
// access token, and transparent refresh-and-retry on a 401.
import { ApiError } from "../../shared/api/client";
import { clearAccessToken, decodeJwtExpiry, getAccessToken, setAccessToken } from "../auth/tokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Set by AuthContext once, so any 401 that survives a refresh attempt can
// force the app back to a logged-out state without every call site having
// to handle that itself.
let onSessionExpired = () => {};
export function registerSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function parseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json().catch(() => null);
}

// Talks to /auth/refresh directly (not via adminFetch) to avoid the two
// functions recursively retrying each other. Returns the new access token,
// or null if the refresh cookie is missing/expired/revoked.
//
// Deduplicated via a shared in-flight promise: the refresh token is
// rotated server-side on every use (see auth_service.py), so two
// *concurrent* calls here are not "two refreshes" - the second one would
// arrive after the first has already rotated the cookie away, and the
// backend's reuse-detection would treat that as a stolen token and kill
// the whole session. This isn't a hypothetical - React StrictMode's
// double-invoked effects hit exactly this path on mount, and the same
// race is just as real from multiple browser tabs or several API calls
// 401-ing at once. Every concurrent caller instead awaits one shared
// request.
let inFlightRefresh = null;

export function silentRefresh() {
  if (inFlightRefresh) return inFlightRefresh;
  inFlightRefresh = performRefresh().finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}

async function performRefresh() {
  const csrfToken = readCookie("csrf_refresh_token");
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {},
    });
  } catch {
    return null;
  }
  if (!response.ok) {
    clearAccessToken();
    return null;
  }
  const data = await parseBody(response);
  if (!data?.accessToken) return null;
  setAccessToken(data.accessToken);
  return data.accessToken;
}

export function scheduleProactiveRefresh() {
  const token = getAccessToken();
  const expiresAt = token ? decodeJwtExpiry(token) : null;
  if (!expiresAt) return null;

  // Refresh 60s before actual expiry, but never schedule something
  // negative/immediate if the token is already nearly dead.
  const delay = Math.max(expiresAt - Date.now() - 60_000, 5_000);
  return window.setTimeout(async () => {
    const refreshed = await silentRefresh();
    if (refreshed) {
      scheduleProactiveRefresh();
    } else {
      onSessionExpired();
    }
  }, delay);
}

export async function adminFetch(path, { method = "GET", body, headers = {}, retry = true } = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const token = getAccessToken();

  const init = {
    method,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body !== undefined) {
    init.body = isFormData ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError("Network error - could not reach the server.", 0, null);
  }

  if (response.status === 401 && retry) {
    const refreshedToken = await silentRefresh();
    if (refreshedToken) {
      return adminFetch(path, { method, body, headers, retry: false });
    }
    onSessionExpired();
  }

  const data = await parseBody(response);
  if (!response.ok) {
    throw new ApiError(data?.error || `Request failed with status ${response.status}`, response.status, data);
  }
  return data;
}

// For endpoints that return a file (résumé download) rather than JSON -
// same auth/refresh-and-retry handling as adminFetch, but resolves to a
// Blob. Used instead of a plain <a href> so the download still carries
// the Authorization header a public link never could (Document 5 §4.6:
// résumés are never served from a guessable public path).
export async function adminFetchBlob(path, { retry = true } = {}) {
  const token = getAccessToken();
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new ApiError("Network error - could not reach the server.", 0, null);
  }

  if (response.status === 401 && retry) {
    const refreshedToken = await silentRefresh();
    if (refreshedToken) {
      return adminFetchBlob(path, { retry: false });
    }
    onSessionExpired();
  }

  if (!response.ok) {
    const data = await parseBody(response);
    throw new ApiError(data?.error || `Request failed with status ${response.status}`, response.status, data);
  }

  const disposition = response.headers.get("content-disposition") || "";
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
  return { blob: await response.blob(), filename: filenameMatch?.[1] };
}
