// Mirrors backend/app/models/appointment.py's appointment_mode enum - one
// place to add a label/icon if a fourth mode is ever surfaced, instead of
// hunting through every page that renders it.
export const APPOINTMENT_MODE_LABELS = {
  phone: "Phone",
  zoom: "Zoom Meeting",
  in_person: "In-Person",
  other: "Online Meeting",
};

export function formatAppointmentMode(mode) {
  return APPOINTMENT_MODE_LABELS[mode] || "-";
}

// The phone number to actually call for a "phone" mode appointment. Prefers
// clientPhone (always a clean number when present - collected on our own
// site before Calendly's widget loads, see appointment_service.py) and
// falls back to locationDetail, which is where a sync-only row's
// Calendly-reported number lands instead (see appointment_sync_service.py -
// not stored in clientPhone because Calendly's format isn't guaranteed to
// match that column's bare-10-digit assumption).
export function getCallablePhone(appointment) {
  return appointment.clientPhone || appointment.locationDetail || null;
}
