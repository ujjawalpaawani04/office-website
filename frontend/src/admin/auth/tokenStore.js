// In-memory-only holder for the admin access token - deliberately never
// localStorage/sessionStorage, so an XSS payload can't read a persisted
// token; a reload just loses it, which is why AuthContext calls /auth/refresh
// on boot to re-establish a session from the httpOnly refresh cookie instead.
let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

// Reads the unsigned payload of a JWT to get its `exp` (seconds since
// epoch). This is NOT verification - the server already verified the
// signature when it issued the token - it's only used client-side to know
// when to proactively refresh before the token actually expires.
export function decodeJwtExpiry(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const { exp } = JSON.parse(json);
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}
