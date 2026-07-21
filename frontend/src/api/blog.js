import { apiFetch } from "./client";

export function getBlogPosts() {
  return apiFetch("/blog/posts");
}

export function getBlogPostBySlug(slug) {
  return apiFetch(`/blog/posts/${encodeURIComponent(slug)}`);
}

export function getRelatedPosts(slug, limit = 3) {
  return apiFetch(`/blog/posts/${encodeURIComponent(slug)}/related?limit=${limit}`);
}

export function getBlogCategories() {
  return apiFetch("/blog/categories");
}

export function getBlogTags() {
  return apiFetch("/blog/tags");
}
