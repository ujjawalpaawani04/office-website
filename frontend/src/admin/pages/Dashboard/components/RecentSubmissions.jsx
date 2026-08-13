import { Link } from "react-router-dom";
import { EmptyState } from "../../../components/EmptyState";
import { Skeleton } from "../../../components/Skeleton";

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

// Restructured from two separate side-by-side cards into one unified,
// chronologically-sorted feed of both submission types - same underlying
// fields as before (name, service/email or positionAppliedFor, status,
// createdAt), just presented as a single list instead of two boxes.
export function RecentSubmissions({ enquiries, applications, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    );
  }

  const items = [
    ...enquiries.map((e) => ({
      id: `enquiry-${e.id}`,
      type: "Enquiry",
      primary: e.name,
      secondary: e.service || e.email,
      status: e.status,
      createdAt: e.createdAt,
    })),
    ...applications.map((a) => ({
      id: `application-${a.id}`,
      type: "Application",
      primary: a.name,
      secondary: a.positionAppliedFor,
      status: a.status,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (items.length === 0) {
    return <EmptyState title="No submissions yet" description="Contact and Career page submissions will appear here." />;
  }

  return (
    <ul className="divide-y divide-secondary/5">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/[0.02]">
          <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-secondary/35">
            {item.type}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-secondary">{item.primary}</p>
            <p className="truncate text-xs text-secondary/45">{item.secondary}</p>
          </div>
          <span className="shrink-0 text-xs capitalize text-secondary/50">{item.status?.replace(/_/g, " ")}</span>
          <span className="w-16 shrink-0 text-right text-xs text-secondary/35">{timeAgo(item.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}

export function RecentSubmissionsLinks() {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold text-secondary/50">
      <Link to="/admin/enquiries" className="hover:text-brand-700">
        All enquiries
      </Link>
      <Link to="/admin/job-applications" className="hover:text-brand-700">
        All applications
      </Link>
    </div>
  );
}
