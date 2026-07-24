import { useCallback, useState } from "react";
import { FiInbox } from "react-icons/fi";

import { listJobApplications } from "../../api/jobApplicationsApi";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { JobApplicationDrawer } from "./JobApplicationDrawer";

const STATUS_OPTIONS = ["", "new", "reviewed", "shortlisted", "rejected", "hired"];

export default function JobApplications() {
  useBreadcrumb([{ label: "Job Applications" }]);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const fetcher = useCallback(() => listJobApplications({ page, pageSize: 20, q, status }), [page, q, status]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  if (error) return <ErrorState message="Could not load applications." onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Job Applications" description="Submissions from the Career page." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name or email..." />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s ? s[0].toUpperCase() + s.slice(1) : "All statuses"}</option>)}
        </select>
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiInbox, title: "No applications yet", description: "Submissions from the Career page will appear here." }}
        getRowId={(row) => row.id}
        columns={[
          { key: "name", label: "Name" },
          { key: "positionAppliedFor", label: "Position" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "createdAt", label: "Applied", render: (row) => new Date(row.createdAt).toLocaleDateString() },
        ]}
        actions={(row) => (
          <button
            type="button"
            onClick={() => setSelected(row)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            View
          </button>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <JobApplicationDrawer application={selected} onClose={() => setSelected(null)} onChanged={refetch} />
    </div>
  );
}
