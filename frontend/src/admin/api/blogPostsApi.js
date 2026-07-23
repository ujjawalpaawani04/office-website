import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

export const blogPostsApi = {
  ...createResourceApi("/admin/blog/posts"),
  updateStatus(id, status) {
    return adminFetch(`/admin/blog/posts/${id}/status`, { method: "PATCH", body: { status } });
  },
};

export function fetchBlogCategoryOptions() {
  return adminFetch("/admin/blog/categories/options");
}
export function fetchBlogTagOptions() {
  return adminFetch("/admin/blog/tags/options");
}
export function fetchBlogAuthorOptions() {
  return adminFetch("/admin/blog/authors/options");
}
