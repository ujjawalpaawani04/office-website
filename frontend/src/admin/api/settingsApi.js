import { adminFetch } from "./adminClient";

export function fetchSiteSettings() {
  return adminFetch("/admin/site-settings");
}

export function updateSiteSettings(payload) {
  return adminFetch("/admin/site-settings", { method: "PUT", body: payload });
}
