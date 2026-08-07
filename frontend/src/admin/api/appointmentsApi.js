import { adminFetch, adminFetchBlob } from "./adminClient";

export function listAppointments(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/appointments${query ? `?${query}` : ""}`);
}

// All-time counts by default - unaffected by the list's own search/status
// filters (see appointments_routes.py). Pass { dateFrom, dateTo } (ISO
// instants) to scope the counts to a date range instead, e.g. "today" for
// the Meeting Type Summary cards.
export function getAppointmentStats(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/appointments/stats${query ? `?${query}` : ""}`);
}

export function deleteAppointment(id) {
  return adminFetch(`/admin/appointments/${id}`, { method: "DELETE" });
}

export function bulkDeleteAppointments(ids) {
  return adminFetch("/admin/appointments/bulk-delete", { method: "POST", body: { ids } });
}

export function syncAppointments() {
  return adminFetch("/admin/appointments/sync", { method: "POST" });
}

// Same pattern as exportEnquiries - requires the admin JWT, so a plain
// <a href> can't carry it; fetched as a blob and downloaded client-side.
export function exportAppointments(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetchBlob(`/admin/appointments/export${query ? `?${query}` : ""}`);
}
