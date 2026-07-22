import { adminFetch } from "./adminClient";

export function listSessions(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/security/sessions${query ? `?${query}` : ""}`);
}

export function revokeSession(id) {
  return adminFetch(`/admin/security/sessions/${id}/revoke`, { method: "POST" });
}

export function listFailedLogins(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/security/failed-logins${query ? `?${query}` : ""}`);
}
