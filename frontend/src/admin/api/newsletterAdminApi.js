import { ApiError } from "../../shared/api/client";
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

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 80; // ~2 minutes - matches the backend send's own subprocess-style timeout budget

// The backend now returns immediately (202) with the send running in a
// background thread (see newsletter_service.start_newsletter_campaign),
// rather than blocking the request on however many subscribers exist.
// Polling is kept entirely inside this function so every existing caller
// (BlogPostEditor.jsx, ServiceEditor.jsx) is unaffected - they still just
// `await sendNewsletter(...)` and get back the same final
// {recipientCount, successCount, failureCount} shape as before, it just
// takes a little longer to resolve now.
export async function sendNewsletter(payload) {
  const { campaignId } = await adminFetch("/admin/newsletter/send", { method: "POST", body: payload });

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const campaign = await adminFetch(`/admin/newsletter/campaigns/${campaignId}`);
    if (campaign.status !== "sending") {
      return {
        recipientCount: campaign.recipientCount,
        successCount: campaign.successCount,
        failureCount: campaign.failureCount,
      };
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new ApiError(
    "The newsletter is still sending in the background - check the Newsletter section shortly for the result.",
    0,
    null
  );
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
