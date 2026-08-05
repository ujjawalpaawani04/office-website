import { APPOINTMENT_MODE_META, formatAppointmentMode } from "../../utils/appointmentMode";
import { TONE_STYLES } from "../../utils/tone";

// Small colored icon + label for the table's Meeting Type column - mirrors
// StatusBadge's role for the Status column, but for appointment_mode.
export function MeetingTypeBadge({ mode }) {
  const meta = APPOINTMENT_MODE_META[mode];
  if (!meta) return <span className="text-sm text-secondary/60">-</span>;

  const { icon: Icon, tone } = meta;
  const { bg, text } = TONE_STYLES[tone];
  return (
    <span className="inline-flex items-center gap-2 text-sm text-secondary/80">
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${bg} ${text}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      {formatAppointmentMode(mode)}
    </span>
  );
}
