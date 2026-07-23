import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

// remove() (inherited DELETE) only closes an opening (is_active=false,
// applications kept) - the backend registers it with soft_delete_field.
// deletePermanent() hits the separate hard-delete route, only allowed once
// an opening is already closed.
export const jobOpeningsApi = {
  ...createResourceApi("/admin/job-openings"),
  deletePermanent(id) {
    return adminFetch(`/admin/job-openings/${id}/permanent`, { method: "DELETE" });
  },
};
