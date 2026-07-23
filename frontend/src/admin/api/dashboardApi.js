import { adminFetch } from "./adminClient";

export function fetchDashboardSummary() {
  return adminFetch("/admin/dashboard/summary");
}

export function fetchRecentActivity() {
  return adminFetch("/admin/dashboard/activity");
}
