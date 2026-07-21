const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://office-website-m9uu.onrender.com";

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
