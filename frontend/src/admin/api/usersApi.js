import { adminFetch } from "./adminClient";
import { createResourceApi } from "./createResourceApi";

// Overrides `update` to PATCH, not PUT - the backend route is a partial
// update by design (name/role/isActive only; password is never editable
// through this surface), matching every other partial-update endpoint
// (enquiries, job applications) rather than createResourceApi's default
// full-replace PUT semantics.
export const usersApi = {
  ...createResourceApi("/admin/users"),
  update(id, payload) {
    return adminFetch(`/admin/users/${id}`, { method: "PATCH", body: payload });
  },
  resetPassword(id) {
    return adminFetch(`/admin/users/${id}/reset-password`, { method: "POST" });
  },
};
