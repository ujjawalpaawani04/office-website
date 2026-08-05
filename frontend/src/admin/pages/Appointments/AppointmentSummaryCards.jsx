import { FiCalendar, FiCheckCircle, FiCheckSquare, FiClock, FiRepeat, FiXCircle } from "react-icons/fi";
import { StatCard } from "../../components/StatCard";
import { APPOINTMENT_MODE_LABELS, APPOINTMENT_MODE_META } from "../../utils/appointmentMode";

const STATUS_META = [
  { key: "confirmed", label: "Confirmed", icon: FiCheckCircle, tone: "green" },
  { key: "pending", label: "Pending", icon: FiClock, tone: "amber" },
  { key: "completed", label: "Completed", icon: FiCheckSquare, tone: "blue" },
  { key: "cancelled", label: "Cancelled", icon: FiXCircle, tone: "red" },
  { key: "rescheduled", label: "Rescheduled", icon: FiRepeat, tone: "violet" },
];

// Fixed display order; "other" only shows up if this dataset actually has
// any (most don't - Calendly location types resolve to phone/zoom/in_person
// almost always), so a stray "Online Meeting" doesn't add a near-empty 4th
// card to every dataset that does.
const MODE_ORDER = ["zoom", "phone", "in_person", "other"];

function percentOf(count, total) {
  return total ? `${((count / total) * 100).toFixed(1)}% of total` : "0% of total";
}

// Tailwind's JIT scanner needs literal class strings, not a template
// literal built from `modes.length` - this lookup is what actually lets
// `sm:grid-cols-4` exist in the compiled CSS for the rare "other" case.
const MODE_GRID_COLS = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };

// Two "at a glance" summary sections above the Appointments table - counts
// are all-time and unaffected by the toolbar's own filters (see
// getAppointmentStats/appointment_stats route), so they read as the health
// of the whole dataset, not just the current view.
export function AppointmentSummaryCards({ stats, loading }) {
  const total = stats?.total ?? 0;
  const byStatus = stats?.byStatus || {};
  const byMode = stats?.byMode || {};
  const modes = MODE_ORDER.filter((mode) => mode !== "other" || (byMode.other ?? 0) > 0);

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
        <div className={`grid grid-cols-1 gap-4 ${MODE_GRID_COLS[modes.length] || "sm:grid-cols-3"}`}>
          {modes.map((mode) => (
            <StatCard
              key={mode}
              label={APPOINTMENT_MODE_LABELS[mode]}
              value={byMode[mode] ?? 0}
              icon={APPOINTMENT_MODE_META[mode].icon}
              tone={APPOINTMENT_MODE_META[mode].tone}
              loading={loading}
              sublabel={percentOf(byMode[mode] ?? 0, total)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
