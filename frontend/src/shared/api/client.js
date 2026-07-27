// Falls back to the page's own hostname (not a hardcoded IP) so the API
// origin always matches whatever host the browser used to load the app -
// localhost, a LAN IP, or a future DHCP-reassigned IP all work with zero
// .env edits. This also matters for cookie-based auth: the admin panel's
// refresh-token cookie is SameSite=Strict, which the browser will only
// attach when the API call's host matches the page's host, so a mismatch
// here (e.g. page on localhost, API hardcoded to a LAN IP) breaks
// session-restore-on-refresh even though the cookie itself is set correctly.
// Production still sets VITE_API_BASE_URL explicitly (frontend/API usually
// live on different domains there), which takes precedence.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch(path, { method = "GET", body, headers = {}, signal } = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const init = {
    method,
    credentials: "include",
    headers: isFormData ? headers : { "Content-Type": "application/json", ...headers },
    signal,
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

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    throw new ApiError(
      data?.error || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}
