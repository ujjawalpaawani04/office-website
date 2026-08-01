import { Drawer } from "../../components/Drawer";
import { StatusBadge } from "../../components/StatusBadge";

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

  return (
    <Drawer open={Boolean(appointment)} title="Appointment Details" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-lg font-semibold text-secondary">{appointment.clientName}</p>
          <p className="text-sm text-secondary/60">
            <a href={`mailto:${appointment.clientEmail}`} className="hover:underline">{appointment.clientEmail}</a>
            {" "}&middot; {appointment.clientPhone}
          </p>
        </div>

        <div>
          <StatusBadge status={appointment.status} />
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <Field label="Event" value={appointment.eventName} />
          <Field label="Timezone" value={appointment.timezone} />
          <Field label="Meeting Date" value={appointment.meetingDate ? new Date(appointment.meetingDate).toLocaleDateString() : null} />
          <Field label="Meeting Time" value={appointment.meetingTime ? appointment.meetingTime.slice(0, 5) : null} />
          <Field label="Starts At" value={appointment.startsAt ? new Date(appointment.startsAt).toLocaleString() : null} />
          <Field label="Ends At" value={appointment.endsAt ? new Date(appointment.endsAt).toLocaleString() : null} />
          <Field label="Source" value={appointment.source} />
          <Field label="Booked On" value={new Date(appointment.createdAt).toLocaleString()} />
        </dl>

        {appointment.meetingLink ? (
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

        {appointment.notes ? (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary/40">Notes</p>
            <p className="rounded-lg bg-secondary/5 p-3 text-sm text-secondary/80 whitespace-pre-line">{appointment.notes}</p>
          </div>
        ) : null}

        {appointment.cancelReason ? (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary/40">Cancel Reason</p>
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{appointment.cancelReason}</p>
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
