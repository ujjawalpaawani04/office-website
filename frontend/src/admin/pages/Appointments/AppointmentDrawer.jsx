import { FiPhoneCall, FiVideo } from "react-icons/fi";
import { Drawer } from "../../components/Drawer";
import { formatAppointmentMode, getCallablePhone } from "../../utils/appointmentMode";
import { formatMeetingDate, formatMeetingTime } from "../../utils/appointmentTime";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary/40">{label}</p>
      <p className="mt-0.5 text-sm text-secondary/80">{value || "-"}</p>
    </div>
  );
}

export function AppointmentDrawer({ appointment, onClose }) {
  if (!appointment) return null;

  const callablePhone = getCallablePhone(appointment);

  return (
    <Drawer open={Boolean(appointment)} title="Appointment Details" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-lg font-semibold text-secondary">{appointment.clientName}</p>
          <p className="text-sm text-secondary/60">
            <a href={`mailto:${appointment.clientEmail}`} className="hover:underline">{appointment.clientEmail}</a>
          </p>
        </div>

        {/* Exactly these 6 fields, in this exact order - no Status, Notes,
            Timezone, or Location, regardless of appointment type. */}
        <dl className="grid grid-cols-2 gap-3">
          <Field label="Event" value={appointment.eventName} />
          <Field label="Booked on" value={new Date(appointment.createdAt).toLocaleString()} />
          <Field label="Appointment type" value={formatAppointmentMode(appointment.appointmentMode)} />
          <Field label="Phone number" value={appointment.clientPhone || "N/A"} />
          <Field label="Meeting date" value={formatMeetingDate(appointment)} />
          <Field label="Meeting time" value={formatMeetingTime(appointment)} />
        </dl>

        {appointment.appointmentMode === "zoom" && appointment.meetingLink ? (
          <a
            href={appointment.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <FiVideo className="h-4 w-4" aria-hidden="true" />
            Join Meeting
          </a>
        ) : appointment.appointmentMode === "phone" && callablePhone ? (
          <a
            href={`tel:${callablePhone}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <FiPhoneCall className="h-4 w-4" aria-hidden="true" />
            Call {callablePhone}
          </a>
        ) : appointment.meetingLink ? (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary/40">Meeting Link</p>
            <a
              href={appointment.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="block truncate rounded-lg bg-secondary/5 p-3 text-sm text-brand-700 hover:underline"
            >
              {appointment.meetingLink}
            </a>
          </div>
        ) : null}

        <a
          href={`mailto:${appointment.clientEmail}`}
          className="block w-full rounded-lg bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-800"
        >
          Email Client
        </a>
      </div>
    </Drawer>
  );
}
