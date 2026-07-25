import { useCallback } from "react";
import { FiActivity, FiBriefcase, FiFileText, FiInbox, FiMail } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { fetchDashboardSummary, fetchRecentActivity } from "../../api/dashboardApi";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { Skeleton } from "../../components/Skeleton";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function Dashboard() {
  useBreadcrumb([{ label: "Dashboard" }]);

  const fetcher = useCallback(
    async () => ({
      summary: await fetchDashboardSummary(),
      activity: await fetchRecentActivity(),
    }),
    []
  );
  const { data, error, loading, refetch } = useAsyncData(fetcher, []);
  const summary = data?.summary;
  const activity = data?.activity;

  if (error) {
    return (
      <ErrorState
        message={error instanceof ApiError ? error.message : "Could not load the dashboard."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="New Enquiries" value={summary?.newEnquiries} icon={FiMail} loading={loading} />
        <StatCard label="New Applications" value={summary?.newApplications} icon={FiBriefcase} loading={loading} />
        <StatCard label="Published Posts" value={summary?.publishedPosts} icon={FiFileText} loading={loading} />
        <StatCard label="Active Openings" value={summary?.activeJobOpenings} icon={FiInbox} loading={loading} />
        <StatCard label="Subscribers" value={summary?.newsletterSubscribers} icon={FiActivity} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-secondary/10 bg-white p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-secondary">Recent Enquiries</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : summary.recentEnquiries.length === 0 ? (
            <EmptyState title="No enquiries yet" description="Submissions from the Contact page will appear here." />
          ) : (
            <ul className="divide-y divide-secondary/5">
              {summary.recentEnquiries.map((enquiry) => (
                <li key={enquiry.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-secondary">{enquiry.name}</p>
                    <p className="truncate text-xs text-secondary/50">{enquiry.service || enquiry.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-secondary/40">{timeAgo(enquiry.createdAt)}</span>
                    <StatusBadge status={enquiry.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-secondary/10 bg-white p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-secondary">Recent Applications</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : summary.recentApplications.length === 0 ? (
            <EmptyState title="No applications yet" description="Submissions from the Career page will appear here." />
          ) : (
            <ul className="divide-y divide-secondary/5">
              {summary.recentApplications.map((application) => (
                <li key={application.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-secondary">{application.name}</p>
                    <p className="truncate text-xs text-secondary/50">{application.positionAppliedFor}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-secondary/40">{timeAgo(application.createdAt)}</span>
                    <StatusBadge status={application.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-secondary/10 bg-white p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-secondary">Recent Activity</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <EmptyState title="No activity recorded yet" />
        ) : (
          <ul className="space-y-3">
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span className="text-secondary/80">
                  <span className="font-medium text-secondary">{entry.adminName || "System"}</span>{" "}
                  <span className="capitalize">{entry.action}</span>{" "}
                  {entry.entityType ? <span className="text-secondary/50">({entry.entityType})</span> : null}
                </span>
                <span className="ml-auto shrink-0 text-xs text-secondary/40">{timeAgo(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
