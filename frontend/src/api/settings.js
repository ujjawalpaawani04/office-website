import { apiFetch } from "./client";

// Public counterpart to the admin Site Settings screen - no auth, read-only.
export function getSiteSettings() {
  return apiFetch("/site-settings");
}
