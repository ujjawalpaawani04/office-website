import { useEffect, useState } from "react";
import { formatRelativeTime } from "../utils/relativeTime";

// Re-renders every `intervalMs` so a displayed "2 minutes ago" advances to
// "3 minutes ago" on its own, without the underlying `date` ever changing -
// used by the Appointments page's Last Synced label.
export function useRelativeTime(date, intervalMs = 30000) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!date) return undefined;
    const id = window.setInterval(() => forceTick((n) => n + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [date, intervalMs]);

  return formatRelativeTime(date);
}
