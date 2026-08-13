import { useCallback } from "react";
import { FiActivity, FiBriefcase, FiFileText, FiInbox, FiMail } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { fetchDashboardSummary, fetchRecentActivity } from "../../api/dashboardApi";
import { ErrorState } from "../../components/ErrorState";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { DashboardHeader } from "./components/DashboardHeader";
import { KpiCard } from "./components/KpiCard";
import { OverviewInsights } from "./components/OverviewInsights";
import { RecentActivityFeed } from "./components/RecentActivityFeed";
import { RecentList } from "./components/RecentList";

const CARD = "rounded-2xl border border-secondary/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(1,24,24,0.03),0_8px_24px_-12px_rgba(1,24,24,0.06)]";

export default function Dashboard() {
  useBreadcrumb([{ label: "Dashboard" }]);

  // Unchanged from before the redesign: same two endpoints, same shape,
  // same loading/error/refetch handling - only the presentation below is
  // new.
  const fetcher = useCallback(
    async () => ({
      summary: await fetchDashboardSummary(),
      activity: await fetchRecentActivity(),
    }),
    []
  );
  const { data, error, loading, refetch } = useAsyncData(fetcher);
  const summary = data?.summary;
  const activity = data?.activity || [];

  if (error) {
    return (
      <ErrorState
        message={error instanceof ApiError ? error.message : "Could not load the dashboard."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="New Enquiries" value={summary?.newEnquiries} icon={FiMail} loading={loading} to="/admin/enquiries" />
        <KpiCard label="New Applications" value={summary?.newApplications} icon={FiBriefcase} loading={loading} to="/admin/job-applications" />
        <KpiCard label="Published Posts" value={summary?.publishedPosts} icon={FiFileText} loading={loading} to="/admin/blog/posts" />
        <KpiCard label="Active Openings" value={summary?.activeJobOpenings} icon={FiInbox} loading={loading} to="/admin/job-openings" />
        <KpiCard label="Subscribers" value={summary?.newsletterSubscribers} icon={FiActivity} loading={loading} to="/admin/newsletter" />
      </div>

      <section className={CARD}>
        <h2 className="mb-6 font-display text-sm font-semibold text-secondary">Overview</h2>
        <OverviewInsights summary={summary} loading={loading} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentList
          title="Recent Enquiries"
          viewAllTo="/admin/enquiries"
          items={summary?.recentEnquiries || []}
          loading={loading}
          emptyTitle="No enquiries yet"
          emptyDescription="Submissions from the Contact page will appear here."
          secondaryText={(enquiry) => enquiry.service || enquiry.email}
        />
        <RecentList
          title="Recent Applications"
          viewAllTo="/admin/job-applications"
          items={summary?.recentApplications || []}
          loading={loading}
          emptyTitle="No applications yet"
          emptyDescription="Submissions from the Career page will appear here."
          secondaryText={(application) => application.positionAppliedFor}
        />
      </div>

      <section className={CARD}>
        <h2 className="mb-4 font-display text-sm font-semibold text-secondary">Recent Activity</h2>
        <RecentActivityFeed activity={activity} loading={loading} />
      </section>
    </div>
  );
}
