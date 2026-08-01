import { adminFetch } from "./adminClient";

// Create/update are multipart (thumbnail image + MP4 video, both optional
// on update - omitting a file keeps the existing one), so this can't go
// through createResourceApi's plain-JSON shape like the simpler resources.
function toFormData({ title, shortDescription, status, displayOrder, thumbnailFile, videoFile }) {
  const formData = new FormData();
  formData.append("title", title ?? "");
  formData.append("shortDescription", shortDescription ?? "");
  formData.append("status", status ?? "draft");
  formData.append("displayOrder", String(displayOrder ?? 0));
  if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
  if (videoFile) formData.append("video", videoFile);
  return formData;
}

export const articlesApi = {
  list(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    return adminFetch(`/admin/articles${query ? `?${query}` : ""}`);
  },
  get(id) {
    return adminFetch(`/admin/articles/${id}`);
  },
  create(fields) {
    return adminFetch("/admin/articles", { method: "POST", body: toFormData(fields) });
  },
  update(id, fields) {
    return adminFetch(`/admin/articles/${id}`, { method: "PUT", body: toFormData(fields) });
  },
  remove(id) {
    return adminFetch(`/admin/articles/${id}`, { method: "DELETE" });
  },
};
