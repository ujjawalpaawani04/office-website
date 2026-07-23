import { apiFetch } from "./client";

export function subscribeToNewsletter(email) {
  return apiFetch("/newsletter/subscribe", { method: "POST", body: { email } });
}

export function unsubscribeFromNewsletter(token) {
  return apiFetch(`/newsletter/unsubscribe/${token}`, { method: "POST" });
}
