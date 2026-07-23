import { adminFetch } from "./adminClient";

export function listMedia(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/media${query ? `?${query}` : ""}`);
}

export function uploadMedia(file, altText) {
  const formData = new FormData();
  formData.append("file", file);
  if (altText) formData.append("altText", altText);
  return adminFetch("/admin/media", { method: "POST", body: formData });
}

export function updateMedia(id, altText) {
  return adminFetch(`/admin/media/${id}`, { method: "PATCH", body: { altText } });
}

export function deleteMedia(id) {
  return adminFetch(`/admin/media/${id}`, { method: "DELETE" });
}
