import { apiFetch } from "../../shared/api/client";

export function getServices() {
  return apiFetch("/services");
}

export function getServiceBySlug(slug) {
  return apiFetch(`/services/${encodeURIComponent(slug)}`);
}
