import { adminFetch, adminFetchBlob } from "./adminClient";

export function listEnquiries(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/enquiries${query ? `?${query}` : ""}`);
}

export function updateEnquiryStatus(id, status) {
  return adminFetch(`/admin/enquiries/${id}`, { method: "PATCH", body: { status } });
}

// The export endpoint requires the same admin JWT as everything else, so
// a plain <a href> can't carry the Authorization header - fetched as a
// blob and downloaded client-side instead, same pattern as résumé download.
export function exportEnquiries(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetchBlob(`/admin/enquiries/export${query ? `?${query}` : ""}`);
}
