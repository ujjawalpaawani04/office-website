import { useCallback, useState } from "react";
import { FiBriefcase, FiEdit2, FiPlus, FiSlash, FiTrash2 } from "react-icons/fi";

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
import { useConfirmAction } from "../../hooks/useConfirmAction";
import { useDrawerForm } from "../../hooks/useDrawerForm";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { JobOpeningForm } from "./JobOpeningForm";

const EMPLOYMENT_LABELS = { full_time: "Full-Time", part_time: "Part-Time", internship: "Internship", contract: "Contract" };

export default function JobOpenings() {
  useBreadcrumb([{ label: "Job Openings" }]);
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const fetcher = useCallback(() => jobOpeningsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const { formKey, formProps, openCreate, openEdit } = useDrawerForm(refetch);
  const closeAction = useConfirmAction((row) => jobOpeningsApi.remove(row.id), {
    successMessage: "Job opening closed.",
    errorMessage: "Could not close.",
    onSuccess: refetch,
  });
  const deleteAction = useConfirmAction((row) => jobOpeningsApi.deletePermanent(row.id), {
    successMessage: "Job opening deleted.",
    errorMessage: "Could not delete.",
    onSuccess: refetch,
  });

  if (error) return <ErrorState message="Could not load job openings." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Job Openings"
        description="Recruitment listings shown on the Career page."
        action={<Button onClick={openCreate}><FiPlus className="h-4 w-4" /> Add Opening</Button>}
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
            <button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {row.isActive ? (
              <button type="button" onClick={() => closeAction.request(row)} aria-label={`Close ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiSlash className="h-4 w-4" />
              </button>
            ) : admin?.role === "admin" ? (
              <button type="button" onClick={() => deleteAction.request(row)} aria-label={`Delete ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <JobOpeningForm key={formKey} {...formProps} />
      <ConfirmDialog
        open={Boolean(closeAction.pending)}
        title={`Close "${closeAction.pending?.title}"?`}
        description="It will be hidden from the public Career page. Existing applications are kept. You can permanently delete it afterward if needed."
        confirmLabel="Close Opening"
        loading={closeAction.busy}
        onConfirm={closeAction.confirm}
        onCancel={closeAction.cancel}
      />
      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Delete "${deleteAction.pending?.title}"?`}
        description="This permanently removes the job opening. Existing applications are kept but lose their link to it. This cannot be undone."
        confirmLabel="Delete"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
