import { adminFetch, adminFetchBlob } from "./adminClient";

export function listJobApplications(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/careers/applications${query ? `?${query}` : ""}`);
}

export function updateJobApplicationStatus(id, status) {
  return adminFetch(`/admin/careers/applications/${id}`, { method: "PATCH", body: { status } });
}

export function deleteJobApplication(id) {
  return adminFetch(`/admin/careers/applications/${id}`, { method: "DELETE" });
}

export function downloadResume(id) {
  return adminFetchBlob(`/admin/careers/applications/${id}/resume`);
}
