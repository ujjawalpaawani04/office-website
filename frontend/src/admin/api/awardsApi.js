import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

// remove() (inherited DELETE) only deactivates an award (is_active=false) -
// the backend registers it with soft_delete_field. deletePermanent() hits
// the separate hard-delete route, only allowed once an award is inactive.
export const awardsApi = {
  ...createResourceApi("/admin/awards"),
  deletePermanent(id) {
    return adminFetch(`/admin/awards/${id}/permanent`, { method: "DELETE" });
  },
};
