import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import { Avatar } from "../../../components/Avatar";
import { EmptyState } from "../../../components/EmptyState";
import { Skeleton } from "../../../components/Skeleton";
import { StatusBadge } from "../../../components/StatusBadge";

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function RecentList({ title, viewAllTo, items, loading, emptyTitle, emptyDescription, secondaryText }) {
  return (
    <section className="rounded-2xl border border-secondary/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(1,24,24,0.03),0_8px_24px_-12px_rgba(1,24,24,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-secondary">{title}</h2>
        {viewAllTo ? (
          <Link to={viewAllTo} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800">
            View all
            <FiArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <ul className="-mx-2 divide-y divide-secondary/[0.05]">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-secondary/[0.02]">
              <Avatar name={item.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-secondary">{item.name}</p>
                <p className="truncate text-xs text-secondary/45">{secondaryText(item)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <StatusBadge status={item.status} />
                <span className="text-[11px] text-secondary/35">{timeAgo(item.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
