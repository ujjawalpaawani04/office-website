import { adminFetch } from "./adminClient";

export function fetchDbStatus() {
  return adminFetch("/admin/db-utilities/status");
}

export function triggerReseed() {
  return adminFetch("/admin/db-utilities/reseed", { method: "POST" });
}
