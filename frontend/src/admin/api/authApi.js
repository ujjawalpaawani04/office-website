// Thin per-endpoint wrappers, matching the pattern already used by
// ../../api/blog.js, careers.js, etc. - one small function per backend
// route, no business logic here.
import { ApiError } from "../../api/client";
import { adminFetch } from "./adminClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function login(email, password) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new ApiError("Network error - could not reach the server.", 0, null);
  }
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    throw new ApiError(data?.error || "Login failed.", response.status, data);
  }
  return data; // { accessToken, admin: { id, name, email, role } }
}

export function fetchCurrentAdmin() {
  return adminFetch("/auth/me");
}

export async function logout() {
  try {
    await adminFetch("/auth/logout", { method: "POST" });
  } catch {
    // Best-effort - local session state is cleared by the caller regardless.
  }
}
