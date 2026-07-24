import { apiFetch } from "../../shared/api/client";

export function getTeamMembers() {
  return apiFetch("/team");
}
