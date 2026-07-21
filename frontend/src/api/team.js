import { apiFetch } from "./client";

export function getTeamMembers() {
  return apiFetch("/team");
}
