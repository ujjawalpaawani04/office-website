import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

// remove() (inherited DELETE) only deactivates a certification (is_active=false)
// - the backend registers it with soft_delete_field. deletePermanent() hits
// the separate hard-delete route, only allowed once a certification is inactive.
export const certificationsApi = {
  ...createResourceApi("/admin/certifications"),
  deletePermanent(id) {
    return adminFetch(`/admin/certifications/${id}/permanent`, { method: "DELETE" });
  },
};
