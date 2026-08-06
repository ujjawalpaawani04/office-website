import { useCallback, useId, useRef, useState } from "react";
import { FiCalendar, FiChevronDown, FiChevronLeft } from "react-icons/fi";
import { cn } from "../../shared/utils/cn";
import { useDismissablePopover } from "../hooks/useDismissablePopover";
import { Button } from "./Button";
import {
  DATE_PRESETS,
  formatDateInputValue,
  formatRangeLabel,
  parseDateInputValue,
  resolvePresetRange,
} from "../utils/appointmentDatePresets";

const dateInputClasses =
  "w-full rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15";

// Toolbar Date Filter for the Appointments page: five one-click presets
// plus two custom pickers, all resolving to the same {preset, from, to,
// label} shape Appointments.jsx sends to the API (see
// appointmentDatePresets.js for why `from`/`to` are real Date instants).
export function DateRangeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null); // null | "custom_date" | "custom_range"
  const [dateInput, setDateInput] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const containerRef = useRef(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setMode(null);
  }, []);
  useDismissablePopover(containerRef, open, close);

  const choosePreset = (preset) => {
    const range = resolvePresetRange(preset);
    onChange({ preset, from: range.from, to: range.to, label: DATE_PRESETS.find((p) => p.value === preset).label });
    close();
  };

  const applyCustomDate = () => {
    const parsed = parseDateInputValue(dateInput);
    if (!parsed) return;
    onChange({ preset: "custom_date", from: parsed, to: parsed, label: parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) });
    close();
  };

  const applyCustomRange = () => {
    const from = parseDateInputValue(fromInput);
    const to = parseDateInputValue(toInput);
    if (!from || !to || from > to) return;
    onChange({ preset: "custom_range", from, to, label: formatRangeLabel(from, to) });
    close();
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-secondary transition-colors duration-150 hover:border-brand-700/40",
          value ? "border-brand-700/40 text-brand-700" : "border-secondary/15"
        )}
      >
        <FiCalendar className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">{value ? value.label : "All Dates"}</span>
        <FiChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-150", open && "rotate-180")} aria-hidden="true" />
      </button>

      <div
        id={panelId}
        role="dialog"
        aria-label="Filter by date"
        className={cn(
          "absolute z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] origin-top-left rounded-xl border border-secondary/10 bg-white p-3 shadow-lg shadow-secondary/10 transition-all duration-150 ease-out",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {mode === null ? (
          <div className="space-y-0.5">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  if (preset.value === "custom_date" || preset.value === "custom_range") {
                    // Re-opening a custom filter starts from what's already
                    // applied instead of a blank picker.
                    if (value?.preset === "custom_date") setDateInput(formatDateInputValue(value.from));
                    if (value?.preset === "custom_range") {
                      setFromInput(formatDateInputValue(value.from));
                      setToInput(formatDateInputValue(value.to));
                    }
                    setMode(preset.value);
                  } else {
                    choosePreset(preset.value);
                  }
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-100 hover:bg-secondary/5",
                  value?.preset === preset.value ? "text-brand-700" : "text-secondary/80"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="flex items-center gap-1 text-xs font-semibold text-secondary/50 hover:text-secondary"
            >
              <FiChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back
            </button>

            {mode === "custom_date" ? (
              <>
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className={dateInputClasses} />
                <Button className="w-full" disabled={!dateInput} onClick={applyCustomDate}>
                  Apply
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-secondary/40">From</label>
                  <input type="date" value={fromInput} onChange={(e) => setFromInput(e.target.value)} className={dateInputClasses} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-secondary/40">To</label>
                  <input type="date" value={toInput} onChange={(e) => setToInput(e.target.value)} min={fromInput || undefined} className={dateInputClasses} />
                </div>
                <Button className="w-full" disabled={!fromInput || !toInput} onClick={applyCustomRange}>
                  Apply
                </Button>
              </>
            )}
          </div>
        )}

        {value ? (
          <div className="mt-1 border-t border-secondary/10 pt-1.5">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                close();
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-secondary/60 hover:bg-secondary/5"
            >
              Clear date filter
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
