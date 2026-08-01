import { apiFetch } from "../../shared/api/client";

// Which services are actually bookable right now (a Calendly event type is
// configured for them on the backend) - never guessed on the frontend.
export function getBookableServices() {
  return apiFetch("/appointments/services");
}

// Real availability for one calendar day, straight from Calendly via the
// backend - never hardcoded slots/hours on the frontend.
export function getAvailability(service, mode, date) {
  const query = new URLSearchParams({ service, mode, date }).toString();
  return apiFetch(`/appointments/availability?${query}`);
}

// Per-day available/unavailable status for a whole month, used to colour
// the custom calendar - a handful of real Calendly calls server-side, not
// one per date.
export function getAvailabilityMonth(service, mode, month) {
  const query = new URLSearchParams({ service, mode, month }).toString();
  return apiFetch(`/appointments/availability-month?${query}`);
}

// multipart/form-data since an optional document may be attached.
export function submitAppointment(formData) {
  return apiFetch("/appointments", { method: "POST", body: formData });
}
