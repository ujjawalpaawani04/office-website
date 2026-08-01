import { adminFetch, adminFetchBlob } from "./adminClient";

export function listAppointments(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/appointments${query ? `?${query}` : ""}`);
}

export function getAppointment(id) {
  return adminFetch(`/admin/appointments/${id}`);
}

export function updateAppointment(id, payload) {
  return adminFetch(`/admin/appointments/${id}`, { method: "PATCH", body: payload });
}

export function downloadAppointmentDocument(id) {
  return adminFetchBlob(`/admin/appointments/${id}/document`);
}
