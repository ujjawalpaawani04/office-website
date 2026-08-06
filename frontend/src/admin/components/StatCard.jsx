import { Link } from "react-router-dom";
import { Skeleton } from "./Skeleton";
import { TONE_STYLES } from "../utils/tone";

// Document 2 §1 Statistic Card - clickable, deep-links into the
// corresponding module pre-filtered, matches every other module's use.
// `tone` and `sublabel` are optional (default to the original brand-only,
// no-sublabel look) so Dashboard.jsx's existing calls render unchanged -
// Appointments' summary cards use both to color-code each status/meeting
// type and show its share of the total (e.g. "57.1% of total").
export function StatCard({ label, value, icon: Icon, to, loading, tone = "brand", sublabel }) {
  const { bg, text } = TONE_STYLES[tone] || TONE_STYLES.brand;
  const content = (
    <div className="flex items-center gap-4 rounded-xl border border-secondary/10 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg} ${text}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary/50">{label}</p>
        {loading ? (
          <Skeleton className="mt-1.5 h-6 w-12" />
        ) : (
          <>
            <p className="mt-0.5 text-2xl font-semibold text-secondary">{value}</p>
            {sublabel ? <p className="mt-0.5 text-xs text-secondary/50">{sublabel}</p> : null}
          </>
        )}
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
