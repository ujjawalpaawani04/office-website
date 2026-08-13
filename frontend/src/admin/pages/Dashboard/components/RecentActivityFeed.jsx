import { useState } from "react";
import { FiActivity, FiChevronDown, FiEdit2, FiLock, FiLogIn, FiLogOut, FiMail, FiPlusCircle, FiTrash2 } from "react-icons/fi";

import { EmptyState } from "../../../components/EmptyState";
import { Skeleton } from "../../../components/Skeleton";

const COLLAPSED_LIMIT = 6;

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

// Cosmetic-only icon per action, derived from the same `action` string the
// API already returns. Every chip uses the same muted neutral treatment as
// the KPI cards' icon chips (bg-secondary/[0.04]) - one consistent icon
// language across the page instead of a different color per action.
function iconFor(action = "") {
  if (action.includes("login") && !action.includes("failed")) return FiLogIn;
  if (action.includes("logout")) return FiLogOut;
  if (action.includes("password") || action.includes("email")) return FiLock;
  if (action.includes("delete")) return FiTrash2;
  if (action.includes("create")) return FiPlusCircle;
  if (action.includes("update") || action.includes("change")) return FiEdit2;
  if (action.includes("enquir") || action.includes("newsletter")) return FiMail;
  return FiActivity;
}

export function RecentActivityFeed({ activity, loading }) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (activity.length === 0) {
    return <EmptyState title="No activity recorded yet" />;
  }

  const visible = expanded ? activity : activity.slice(0, COLLAPSED_LIMIT);
  const hiddenCount = activity.length - visible.length;

  return (
    <div>
      <ul className="relative">
        <div aria-hidden="true" className="absolute left-4 top-2.5 bottom-2.5 w-px bg-secondary/[0.06]" />
        {visible.map((entry) => {
          const Icon = iconFor(entry.action);
          return (
            <li
              key={entry.id}
              className="relative flex items-center gap-3 rounded-lg py-2 pr-1 transition-colors hover:bg-secondary/[0.02]"
            >
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/[0.04] text-secondary/50 ring-4 ring-white">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-secondary/70">
                <span className="font-medium text-secondary">{entry.adminName || "System"}</span>{" "}
                <span className="capitalize">{entry.action.replace(/_/g, " ")}</span>{" "}
                {entry.entityType ? <span className="text-secondary/40">({entry.entityType})</span> : null}
              </span>
              <span className="shrink-0 text-xs text-secondary/35">{timeAgo(entry.createdAt)}</span>
            </li>
          );
        })}
      </ul>

      {activity.length > COLLAPSED_LIMIT ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
          <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
