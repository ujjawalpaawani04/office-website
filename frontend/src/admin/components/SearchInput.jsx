import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

// Debounced search box (Document 2 §0.2: 300ms, server-side ?q=).
export function SearchInput({ value, onChange, placeholder = "Search...", debounceMs = 300 }) {
  const [draft, setDraft] = useState(value);
  // Syncs local draft to an externally-changed `value` (e.g. a "Clear
  // Filters" button elsewhere resetting the query) without an effect:
  // adjusting state directly during render, guarded by comparing against
  // the last-seen prop, is the React-documented pattern for this ("Storing
  // information from previous renders") and avoids the set-state-in-effect
  // rule entirely, since nothing here runs inside a useEffect.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return;
    const id = window.setTimeout(() => onChange(draft), debounceMs);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="relative w-full max-w-xs">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-secondary/15 bg-white py-2 pl-9 pr-3 text-sm text-secondary placeholder-secondary/40 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
      />
    </div>
  );
}
