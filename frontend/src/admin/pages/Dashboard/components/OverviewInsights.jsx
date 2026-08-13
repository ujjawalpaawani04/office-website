import { Skeleton } from "../../../components/Skeleton";

// Composition donut over the same 5 real snapshot counts the KPI row
// already shows - no time-series exists behind this data, so a trend
// line would have to invent history that isn't there. Colors are drawn
// from the theme's own defined palette (brand-700/600/500/200 + the
// "used sparingly" gold accent) rather than a five-color rainbow, so it
// reads as one cohesive family instead of a chart-library default.
const METRICS = [
  { key: "newEnquiries", label: "New Enquiries", color: "#155b5c" },
  { key: "newApplications", label: "New Applications", color: "#2c7a7b" },
  { key: "publishedPosts", label: "Published Posts", color: "#4c9091" },
  { key: "activeJobOpenings", label: "Active Openings", color: "#c9a227" },
  { key: "newsletterSubscribers", label: "Subscribers", color: "#b7d3d2" },
];

export function OverviewInsights({ summary, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <Skeleton className="h-44 w-44 shrink-0 rounded-full" />
        <div className="w-full space-y-3">
          {METRICS.map((m) => (
            <Skeleton key={m.key} className="h-4 w-full max-w-[16rem]" />
          ))}
        </div>
      </div>
    );
  }

  const values = METRICS.map((m) => ({ ...m, value: Number(summary?.[m.key]) || 0 }));
  const total = values.reduce((sum, m) => sum + m.value, 0);

  if (total === 0) {
    return (
      <p className="py-12 text-center text-sm text-secondary/45">
        No activity to summarise yet - numbers will appear here as enquiries, applications and content come in.
      </p>
    );
  }

  const segments = values.reduce((acc, m) => {
    const prevEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
    const end = prevEnd + (m.value / total) * 360;
    return [...acc, { ...m, start: prevEnd, end }];
  }, []);
  const stops = segments.map((m) => `${m.color} ${m.start}deg ${m.end}deg`).join(", ");

  return (
    <div className="flex flex-col items-center gap-10 sm:flex-row">
      <div
        className="relative h-44 w-44 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="font-display text-[26px] font-bold leading-none text-secondary">{total}</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-secondary/40">
            Total activity
          </span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {values.map((m) => {
          const pct = total > 0 ? Math.round((m.value / total) * 100) : 0;
          return (
            <li key={m.key} className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: m.color }} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm text-secondary/70">{m.label}</span>
              <span className="text-sm font-semibold text-secondary">{m.value}</span>
              <span className="w-11 shrink-0 text-right text-xs text-secondary/40">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
