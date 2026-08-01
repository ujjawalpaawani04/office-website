import { adminFetch } from "./adminClient";

export function listAppointments(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/appointments${query ? `?${query}` : ""}`);
}

export function deleteAppointment(id) {
  return adminFetch(`/admin/appointments/${id}`, { method: "DELETE" });
}
