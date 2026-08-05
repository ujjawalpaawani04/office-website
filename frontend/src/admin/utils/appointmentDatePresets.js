// Resolves the Appointments page's Date Filter presets to real start/end
// instants in the browser's own local timezone (not UTC calendar days) -
// "Today" must mean today where the admin actually is. Both the preset
// list and custom picks funnel through the same {from, to} Date pair, sent
// to the backend as full ISO instants (see appointments_routes.py's
// dateFrom/dateTo) rather than bare dates, so there's no server-side
// guessing about which timezone "today" means.
export const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "custom_date", label: "Custom Date" },
  { value: "custom_range", label: "Custom Date Range" },
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Monday-start week, matching how the rest of the admin panel's business
// data (e.g. weekly reporting elsewhere in the firm) is normally read.
function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
}

function endOfMonth(date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

// preset: one of DATE_PRESETS' values except "custom_date"/"custom_range",
// which the caller resolves directly from the picked date input(s) instead
// (see DateRangeFilter.jsx) since they need user input this function
// doesn't have.
export function resolvePresetRange(preset) {
  const now = new Date();
  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "yesterday": {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    }
    case "this_week":
      return { from: startOfWeek(now), to: endOfDay(now) };
    case "this_month":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    default:
      return null;
  }
}

// `dateInputValue` is whatever a native <input type="date"> gives back
// ("YYYY-MM-DD") - parsed as local calendar components (not
// `new Date(string)`, which JS treats as UTC midnight and would shift the
// date by a day in any timezone ahead of UTC, e.g. IST).
export function parseDateInputValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatRangeLabel(from, to) {
  const opts = { month: "short", day: "numeric" };
  const fromLabel = from.toLocaleDateString("en-US", opts);
  const toLabel = to.toLocaleDateString("en-US", { ...opts, year: from.getFullYear() === to.getFullYear() ? undefined : "numeric" });
  return fromLabel === toLabel ? fromLabel : `${fromLabel} - ${toLabel}`;
}
