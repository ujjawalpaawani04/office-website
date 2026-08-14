// See admin/api/adminClient.js for why this defaults to a relative,
// same-origin path (proxied to the backend in dev by vite.config.js).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
  const isJson = contentType.includes("application/json");
  if (!isJson && response.ok) {
    // A 2xx response that isn't JSON almost always means VITE_API_BASE_URL
    // is misconfigured and this request got caught by the SPA's catch-all
    // rewrite (returning index.html) instead of reaching the backend.
    // Still resolves to null exactly as before - this only makes an
    // otherwise-silent misconfiguration diagnosable in the console.
    console.error(
      `[apiFetch] Expected JSON but got "${contentType || "unknown content-type"}" from ${response.url}. ` +
        "Check VITE_API_BASE_URL / the API proxy configuration."
    );
  }
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(
      data?.error || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}
