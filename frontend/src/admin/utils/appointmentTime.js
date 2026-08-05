// Formats an appointment's schedule in the timezone the client actually
// booked in (appointment.timezone, an IANA name like "Asia/Kolkata") rather
// than the admin's own browser timezone - two admins in different
// timezones should see the same time Calendly showed the client, and it
// should match what's in the Calendly dashboard itself.
//
// Falls back to the raw meetingDate/meetingTime columns (already a UTC
// clock reading with no timezone info - see backend/app/models/appointment.py)
// only for older rows that predate startsAt being reliably populated.

function formatInTimezone(startsAt, timeZone, options) {
  if (!startsAt) return null;
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(date);
  } catch {
    // An invalid/unrecognized IANA timezone string falls back to the
    // browser's own timezone rather than throwing.
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
}

export function formatMeetingDate(appointment) {
  const formatted = formatInTimezone(appointment.startsAt, appointment.timezone, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (formatted) return formatted;
  return appointment.meetingDate ? new Date(appointment.meetingDate).toLocaleDateString() : null;
}

export function formatMeetingTime(appointment) {
  const formatted = formatInTimezone(appointment.startsAt, appointment.timezone, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (formatted) return formatted;
  return appointment.meetingTime ? appointment.meetingTime.slice(0, 5) : null;
}

export function formatMeetingSchedule(appointment) {
  const date = formatMeetingDate(appointment);
  if (!date) return "-";
  const time = formatMeetingTime(appointment);
  const zoneLabel = appointment.timezone ? ` (${appointment.timezone})` : "";
  return time ? `${date}, ${time}${zoneLabel}` : `${date}${zoneLabel}`;
}
