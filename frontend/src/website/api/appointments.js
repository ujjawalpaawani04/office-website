import { apiFetch } from "../../shared/api/client";

// Called the instant CalendlyEmbed's onScheduled fires - see
// backend/app/blueprints/appointments/routes.py (POST /api/appointments/booked).
export function createAppointmentFromBooking({
  name,
  email,
  phone,
  notes,
  eventName,
  timezone,
  meetingLink,
  calendlyEventUri,
  calendlyInviteeUri,
  startsAt,
  endsAt,
}) {
  return apiFetch("/appointments/booked", {
    method: "POST",
    body: {
      name,
      email,
      phone,
      notes,
      eventName,
      timezone,
      meetingLink,
      calendlyEventUri,
      calendlyInviteeUri,
      startsAt,
      endsAt,
    },
  });
}
