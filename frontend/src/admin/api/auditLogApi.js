import { adminFetch, adminFetchBlob } from "./adminClient";

export function listAuditLogs(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/audit-logs${query ? `?${query}` : ""}`);
}

export function exportAuditLogs(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetchBlob(`/admin/audit-logs/export${query ? `?${query}` : ""}`);
}
