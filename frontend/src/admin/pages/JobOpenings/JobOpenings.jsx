import { useCallback, useState } from "react";
import { FiBriefcase, FiEdit2, FiPlus, FiSlash, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { jobOpeningsApi } from "../../api/jobOpeningsApi";
import { useAuth } from "../../auth/useAuth";
import { ActiveBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { JobOpeningForm } from "./JobOpeningForm";

const EMPLOYMENT_LABELS = { full_time: "Full-Time", part_time: "Part-Time", internship: "Internship", contract: "Contract" };

export default function JobOpenings() {
  useBreadcrumb([{ label: "Job Openings" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [pendingClose, setPendingClose] = useState(null);
  const [closing, setClosing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => jobOpeningsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleClose = async () => {
    setClosing(true);
    try {
      await jobOpeningsApi.remove(pendingClose.id);
      showToast("Job opening closed.");
      setPendingClose(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not close.", "error");
    } finally {
      setClosing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobOpeningsApi.deletePermanent(pendingDelete.id);
      showToast("Job opening deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message="Could not load job openings." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Job Openings"
        description="Recruitment listings shown on the Career page."
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> Add Opening</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by title..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiBriefcase, title: "No job openings yet" }}
        columns={[
          { key: "title", label: "Title" },
          { key: "location", label: "Location" },
          { key: "employmentType", label: "Type", render: (row) => EMPLOYMENT_LABELS[row.employmentType] || row.employmentType },
          { key: "applicationCount", label: "Applications" },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {row.isActive ? (
              <button type="button" onClick={() => setPendingClose(row)} aria-label={`Close ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiSlash className="h-4 w-4" />
              </button>
            ) : admin?.role === "admin" ? (
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <JobOpeningForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
      />
      <ConfirmDialog
        open={Boolean(pendingClose)}
        title={`Close "${pendingClose?.title}"?`}
        description="It will be hidden from the public Career page. Existing applications are kept. You can permanently delete it afterward if needed."
        confirmLabel="Close Opening"
        loading={closing}
        onConfirm={handleClose}
        onCancel={() => setPendingClose(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This permanently removes the job opening. Existing applications are kept but lose their link to it. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
