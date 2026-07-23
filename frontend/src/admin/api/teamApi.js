import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

// remove() (inherited DELETE) only deactivates a team member (is_active=false)
// - the backend registers it with soft_delete_field. deletePermanent() hits
// the separate hard-delete route, only allowed once a member is inactive.
export const teamApi = {
  ...createResourceApi("/admin/team-members"),
  deletePermanent(id) {
    return adminFetch(`/admin/team-members/${id}/permanent`, { method: "DELETE" });
  },
};
