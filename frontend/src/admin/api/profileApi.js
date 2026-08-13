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

export function requestEmailChangeOtp(newEmail) {
  return adminFetch("/admin/profile/email/request-otp", { method: "POST", body: { newEmail } });
}

export function verifyEmailChangeOtp(otp) {
  return adminFetch("/admin/profile/email/verify-otp", { method: "POST", body: { otp } });
}
