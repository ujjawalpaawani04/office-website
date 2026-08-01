import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../../../shared/utils/cn";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABEL = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

const toIsoDate = (year, month, day) => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

/**
 * Custom month calendar. Every cell's state (available / unavailable / past
 * / selected) is driven entirely by `dayStatus`, which the caller populates
 * from real Calendly availability (GET /api/appointments/availability-month)
 * - this component never assumes business hours or which days are open.
 */
export const Calendar = ({ monthDate, onPrevMonth, onNextMonth, dayStatus, isLoading, selectedDate, onSelectDate, canGoPrev }) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayIso = toIsoDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-700/15 text-brand-700 transition-colors hover:bg-brand-700/5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="font-display text-base font-bold text-black">{MONTH_LABEL.format(monthDate)}</p>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-700/15 text-brand-700 transition-colors hover:bg-brand-700/5"
        >
          <FiChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[11px] font-semibold uppercase tracking-wide text-black/40">
            {d}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />;

          const iso = toIsoDate(year, month, day);
          const isPast = iso < todayIso;
          const status = dayStatus?.[iso]?.status;
          const isAvailable = !isPast && (isLoading || status === "available" || status === undefined);
          const isUnavailable = !isPast && !isLoading && status === "unavailable";
          const isSelected = iso === selectedDate;

          return (
            <button
              key={iso}
              type="button"
              disabled={isPast || isUnavailable}
              aria-pressed={isSelected}
              aria-label={`${iso}${isUnavailable ? " - unavailable" : isPast ? " - past date" : ""}`}
              onClick={() => onSelectDate(iso)}
              className={cn(
                "flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200",
                isPast && "cursor-not-allowed text-black/25 line-through",
                isUnavailable && "cursor-not-allowed bg-black/[0.03] text-black/25",
                isSelected && "bg-brand-700 font-bold text-white",
                isAvailable && !isSelected && "text-black hover:bg-brand-700/10",
                isLoading && !isPast && "animate-pulse"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-black/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-700" aria-hidden="true" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-black/20" aria-hidden="true" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" aria-hidden="true" /> Unavailable
        </span>
      </div>
    </div>
  );
};
