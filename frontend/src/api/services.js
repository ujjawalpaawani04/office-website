import { apiFetch } from "./client";

export function getServices() {
  return apiFetch("/services");
}

export function getServiceBySlug(slug) {
  return apiFetch(`/services/${encodeURIComponent(slug)}`);
}
