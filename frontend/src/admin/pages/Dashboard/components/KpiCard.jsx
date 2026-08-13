import { Link } from "react-router-dom";
import { Skeleton } from "../../../components/Skeleton";

// One consistent card treatment for every KPI - muted neutral icon chip
// (not a different color per card), a large confident number, and a soft
// two-layer shadow that deepens slightly on hover. Restraint here (one
// accent color used only via the hover state, not five competing tones)
// is deliberate - it's what keeps a dense stat row from feeling noisy.
export function KpiCard({ label, value, icon: Icon, to, loading }) {
  const content = (
    <div className="group h-full rounded-2xl border border-secondary/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(1,24,24,0.03),0_8px_24px_-12px_rgba(1,24,24,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-700/15 hover:shadow-[0_1px_2px_rgba(1,24,24,0.04),0_16px_32px_-16px_rgba(1,24,24,0.12)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/[0.04] text-secondary/50 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-secondary/40">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-14" />
      ) : (
        <p className="mt-0.5 font-display text-[28px] font-bold leading-tight text-secondary">{value ?? 0}</p>
      )}
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}
