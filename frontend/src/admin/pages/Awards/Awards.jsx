import { useCallback, useState } from "react";
import { FiAward, FiEdit2, FiPlus, FiSlash, FiTrash2 } from "react-icons/fi";

import { awardsApi } from "../../api/awardsApi";
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
import { AwardForm } from "./AwardForm";

export default function Awards() {
  useBreadcrumb([{ label: "Awards" }]);
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const fetcher = useCallback(() => awardsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const { formKey, formProps, openCreate, openEdit } = useDrawerForm(refetch);
  const deactivateAction = useConfirmAction((row) => awardsApi.remove(row.id), {
    successMessage: "Award deactivated.",
    errorMessage: "Could not deactivate.",
    onSuccess: refetch,
  });
  const deleteAction = useConfirmAction((row) => awardsApi.deletePermanent(row.id), {
    successMessage: "Award deleted.",
    errorMessage: "Could not delete.",
    onSuccess: refetch,
  });

  if (error) return <ErrorState message="Could not load awards." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Awards"
        description="Recognition timeline shown on the About page."
        action={<Button onClick={openCreate}><FiPlus className="h-4 w-4" /> Add Award</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by title..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiAward, title: "No awards yet" }}
        columns={[
          { key: "title", label: "Title" },
          { key: "year", label: "Year" },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {row.isActive ? (
              <button type="button" onClick={() => deactivateAction.request(row)} aria-label={`Deactivate ${row.title}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
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

      <AwardForm key={formKey} {...formProps} />
      <ConfirmDialog
        open={Boolean(deactivateAction.pending)}
        title={`Deactivate "${deactivateAction.pending?.title}"?`}
        description="It will be hidden from the public About page. You can permanently delete it afterward if needed."
        confirmLabel="Deactivate"
        loading={deactivateAction.busy}
        onConfirm={deactivateAction.confirm}
        onCancel={deactivateAction.cancel}
      />
      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Delete "${deleteAction.pending?.title}"?`}
        description="This permanently removes the award. This cannot be undone."
        confirmLabel="Delete"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
