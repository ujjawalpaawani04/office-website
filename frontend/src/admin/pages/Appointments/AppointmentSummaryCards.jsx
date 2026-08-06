import { FiCalendar, FiCheckCircle, FiCheckSquare, FiClock, FiRepeat, FiXCircle } from "react-icons/fi";
import { StatCard } from "../../components/StatCard";
import { APPOINTMENT_MODE_META } from "../../utils/appointmentMode";

const STATUS_META = [
  { key: "confirmed", label: "Confirmed", icon: FiCheckCircle, tone: "green" },
  { key: "pending", label: "Pending", icon: FiClock, tone: "amber" },
  { key: "completed", label: "Completed", icon: FiCheckSquare, tone: "blue" },
  { key: "cancelled", label: "Cancelled", icon: FiXCircle, tone: "red" },
  { key: "rescheduled", label: "Rescheduled", icon: FiRepeat, tone: "violet" },
];

// Fixed 3 modes, always shown (regardless of an "other"/Online Meeting
// count) - labels here are deliberately plural ("Zoom Meetings") since
// they're a category total, distinct from APPOINTMENT_MODE_LABELS' singular
// per-row wording ("Zoom Meeting") used by the table's MeetingTypeBadge.
const MODE_META = [
  { key: "zoom", label: "Zoom Meetings" },
  { key: "phone", label: "Phone Calls" },
  { key: "in_person", label: "In-Person Meetings" },
];

function percentOf(count, total) {
  return total ? `${((count / total) * 100).toFixed(1)}% of total` : "0% of total";
}

// Two "at a glance" summary sections above the Appointments table - counts
// are all-time and unaffected by the toolbar's own filters (see
// getAppointmentStats/appointment_stats route), so they read as the health
// of the whole dataset, not just the current view.
export function AppointmentSummaryCards({ stats, loading }) {
  const total = stats?.total ?? 0;
  const byStatus = stats?.byStatus || {};
  const byMode = stats?.byMode || {};

  return (
    <div className="mb-8 space-y-6">
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold text-secondary">Appointment Status Summary</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total" value={total} icon={FiCalendar} loading={loading} sublabel="All appointments" />
          {STATUS_META.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={byStatus[s.key] ?? 0}
              icon={s.icon}
              tone={s.tone}
              loading={loading}
              sublabel={percentOf(byStatus[s.key] ?? 0, total)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold text-secondary">Meeting Type Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total" value={total} icon={FiCalendar} loading={loading} sublabel="All appointments" />
          {MODE_META.map((m) => (
            <StatCard
              key={m.key}
              label={m.label}
              value={byMode[m.key] ?? 0}
              icon={APPOINTMENT_MODE_META[m.key].icon}
              tone={APPOINTMENT_MODE_META[m.key].tone}
              loading={loading}
              sublabel={percentOf(byMode[m.key] ?? 0, total)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
