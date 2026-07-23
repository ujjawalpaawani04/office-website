import { adminFetch } from "./adminClient";

export function updateProfileName(name) {
  return adminFetch("/admin/profile", { method: "PATCH", body: { name } });
}

export function changePassword(currentPassword, newPassword) {
  return adminFetch("/admin/profile/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}
