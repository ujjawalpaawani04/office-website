import { useCallback, useId, useRef, useState } from "react";
import { FiChevronDown, FiSliders } from "react-icons/fi";
import { cn } from "../../../shared/utils/cn";
import { useDismissablePopover } from "../../hooks/useDismissablePopover";

// Mirrors StatusBadge.jsx's color families for the appointment statuses
// specifically (pending/confirmed/cancelled/rescheduled/completed) - a
// small solid dot reads better in a compact dropdown trigger/list than the
// full pill badge does.
const STATUS_DOT_COLORS = {
  pending: "bg-amber-500",
  confirmed: "bg-green-500",
  cancelled: "bg-red-500",
  rescheduled: "bg-violet-500",
  completed: "bg-blue-500",
};

const STATUS_OPTIONS = ["", "pending", "confirmed", "cancelled", "rescheduled", "completed"];

function StatusDot({ status }) {
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_DOT_COLORS[status] || "bg-secondary/30")} aria-hidden="true" />;
}

function label(status) {
  return status ? status.replace(/^\w/, (c) => c.toUpperCase()) : "All Statuses";
}

// Toolbar Status Filter for the Appointments page - same bordered
// icon+label+chevron visual language as DateRangeFilter, but for the fixed
// appointment status list, so filtering is scannable at a glance via the
// colored dot instead of a bare native <select> option.
export function AppointmentStatusFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);
  useDismissablePopover(containerRef, open, close);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-secondary transition-colors duration-150 hover:border-brand-700/40",
          value ? "border-brand-700/40 text-brand-700" : "border-secondary/15"
        )}
      >
        {value ? <StatusDot status={value} /> : <FiSliders className="h-4 w-4 shrink-0" aria-hidden="true" />}
        <span className="whitespace-nowrap">{label(value)}</span>
        <FiChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-150", open && "rotate-180")} aria-hidden="true" />
      </button>

      <div
        id={panelId}
        role="listbox"
        aria-label="Filter by status"
        className={cn(
          "absolute z-20 mt-2 w-48 max-w-[calc(100vw-2rem)] origin-top-left rounded-xl border border-secondary/10 bg-white p-1.5 shadow-lg shadow-secondary/10 transition-all duration-150 ease-out",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status || "all"}
            type="button"
            role="option"
            aria-selected={value === status}
            onClick={() => {
              onChange(status);
              close();
            }}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-100 hover:bg-secondary/5",
              value === status ? "text-brand-700" : "text-secondary/80"
            )}
          >
            {status ? <StatusDot status={status} /> : <span className="h-2 w-2 shrink-0 rounded-full border border-secondary/30" aria-hidden="true" />}
            {label(status)}
          </button>
        ))}
      </div>
    </div>
  );
}
