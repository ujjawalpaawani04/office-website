import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { cn } from "../../../../shared/utils/cn";
import { MEETING_MODES } from "../appointmentServices";
import { getAvailability, getAvailabilityMonth } from "../../../api/appointments";
import { Calendar } from "./Calendar";

const EASE = [0.22, 1, 0.36, 1];

const toMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const isSameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const formatTimeLabel = (isoStartTime) => {
  const d = new Date(isoStartTime);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(d);
};

export const DateTimeStep = ({ service, mode, date, time, onModeChange, onDateChange, onTimeChange }) => {
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
  const [dayStatus, setDayStatus] = useState({});
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [monthError, setMonthError] = useState(null);

  const [slots, setSlots] = useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Fetch real per-day availability whenever the visible month or service
  // changes - not on every render, and not per-day.
  useEffect(() => {
    if (!service) return undefined;
    let cancelled = false;
    setIsLoadingMonth(true);
    setMonthError(null);

    getAvailabilityMonth(service, mode, toMonthKey(monthDate))
      .then((data) => {
        if (cancelled) return;
        setDayStatus(data.days || {});
      })
      .catch((err) => {
        if (!cancelled) setMonthError(err.message || "Could not load availability.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMonth(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `mode` intentionally excluded: it doesn't change Calendly's event type, only `service` and the visible month do.
  }, [service, monthDate]);

  // Fetch real time slots for the selected date.
  useEffect(() => {
    if (!service || !date) {
      setSlots(null);
      return undefined;
    }
    let cancelled = false;
    setIsLoadingSlots(true);
    setSlotsError(null);

    getAvailability(service, mode, date)
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots || []);
      })
      .catch((err) => {
        if (!cancelled) setSlotsError(err.message || "Could not load available times.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [service, date]);

  const handleSelectDate = (iso) => {
    if (iso !== date) onTimeChange(null);
    onDateChange(iso);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
          How would you like to meet?
        </h3>
        <div role="radiogroup" aria-label="Meeting mode" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MEETING_MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onModeChange(m.key)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-center transition-colors duration-300",
                  isSelected ? "border-brand-700 bg-brand-700/5 ring-1 ring-brand-700" : "border-brand-700/20 hover:border-brand-700/40"
                )}
              >
                <Icon className={isSelected ? "h-5 w-5 text-brand-700" : "h-5 w-5 text-black/60"} aria-hidden="true" />
                <span className="text-sm font-semibold text-black">{m.label}</span>
                <span className="text-xs text-black/60">{m.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
              Select an Available Date
            </h3>

            {monthError ? (
              <p className="flex items-center gap-2 rounded-lg border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
                <FiAlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {monthError}
              </p>
            ) : (
              <Calendar
                monthDate={monthDate}
                onPrevMonth={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                onNextMonth={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                canGoPrev={!isSameMonth(monthDate, startOfMonth(new Date()))}
                dayStatus={dayStatus}
                isLoading={isLoadingMonth}
                selectedDate={date}
                onSelectDate={handleSelectDate}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {mode && date && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
              Select an Available Time
            </h3>

            {isLoadingSlots && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="h-11 animate-pulse rounded-lg bg-black/5" />
                ))}
              </div>
            )}

            {!isLoadingSlots && slotsError && (
              <p className="flex items-center gap-2 rounded-lg border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
                <FiAlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {slotsError}
              </p>
            )}

            {!isLoadingSlots && !slotsError && slots?.length === 0 && (
              <p className="rounded-lg border border-dashed border-brand-700/20 bg-brand-50/40 p-4 text-sm text-black/70">
                No available times on this date. Please choose another date.
              </p>
            )}

            {!isLoadingSlots && !slotsError && slots?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((slot) => {
                  const isSelected = slot.startTime === time?.iso;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onTimeChange({ iso: slot.startTime, label: formatTimeLabel(slot.startTime) })}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors duration-200",
                        isSelected
                          ? "border-brand-700 bg-brand-700 text-white"
                          : "border-brand-700/20 text-black hover:border-brand-700/50 hover:bg-brand-700/5"
                      )}
                    >
                      {formatTimeLabel(slot.startTime)}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
