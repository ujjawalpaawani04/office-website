import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

// remove() (inherited DELETE) only deactivates a testimonial (is_active=false)
// - the backend registers it with soft_delete_field. deletePermanent() hits
// the separate hard-delete route, only allowed once a testimonial is inactive.
export const testimonialsApi = {
  ...createResourceApi("/admin/testimonials"),
  deletePermanent(id) {
    return adminFetch(`/admin/testimonials/${id}/permanent`, { method: "DELETE" });
  },
};
