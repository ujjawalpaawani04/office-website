import { adminFetch, adminFetchBlob } from "./adminClient";

export function listNewsletterSubscribers(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetch(`/admin/newsletter/subscribers${query ? `?${query}` : ""}`);
}

export function unsubscribeSubscriber(id) {
  return adminFetch(`/admin/newsletter/subscribers/${id}/unsubscribe`, { method: "PATCH" });
}

export function subscribeSubscriber(id) {
  return adminFetch(`/admin/newsletter/subscribers/${id}/subscribe`, { method: "PATCH" });
}

export function deleteSubscriber(id) {
  return adminFetch(`/admin/newsletter/subscribers/${id}`, { method: "DELETE" });
}

export function sendNewsletter(payload) {
  return adminFetch("/admin/newsletter/send", { method: "POST", body: payload });
}

// Turns {recipientCount, successCount, failureCount} into an honest toast
// message - a send that fails for every recipient (e.g. an unverified email
// sending domain) must never read as a plain, unqualified success.
export function describeSendResult({ recipientCount, successCount, failureCount }) {
  if (recipientCount === 0) return "No active subscribers to send to.";
  if (failureCount === 0) return `Newsletter sent to ${successCount} subscriber${successCount === 1 ? "" : "s"}.`;
  if (successCount === 0) return `Newsletter failed to send to all ${recipientCount} subscribers - check your email provider settings.`;
  return `Newsletter sent to ${successCount} of ${recipientCount} subscribers (${failureCount} failed).`;
}

export function exportNewsletterSubscribers(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return adminFetchBlob(`/admin/newsletter/subscribers/export${query ? `?${query}` : ""}`);
}
