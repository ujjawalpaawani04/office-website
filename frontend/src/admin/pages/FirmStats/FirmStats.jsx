import { useCallback, useState } from "react";
import { FiActivity, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { firmStatsApi } from "../../api/firmStatsApi";
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
import { FirmStatForm } from "./FirmStatForm";

export default function FirmStats() {
  useBreadcrumb([{ label: "Firm Stats" }]);
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const fetcher = useCallback(() => firmStatsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const { formKey, formProps, openCreate, openEdit } = useDrawerForm(refetch);
  const deleteAction = useConfirmAction((row) => firmStatsApi.remove(row.id), {
    successMessage: "Firm stat deleted.",
    errorMessage: "Could not delete.",
    onSuccess: refetch,
  });

  if (error) return <ErrorState message="Could not load firm stats." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Firm Stats"
        description="The single source of truth for figures like years of experience or clients served - edit here, not in code."
        action={<Button onClick={openCreate}><FiPlus className="h-4 w-4" /> Add Stat</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by key or label..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiActivity, title: "No firm stats yet" }}
        columns={[
          { key: "key", label: "Key", render: (row) => <code className="text-xs text-secondary/60">{row.key}</code> },
          { key: "label", label: "Label" },
          { key: "value", label: "Value", render: (row) => <span className="font-semibold text-secondary">{row.value}{row.suffix}</span> },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.label}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {admin?.role === "admin" ? (
              <button type="button" onClick={() => deleteAction.request(row)} aria-label={`Delete ${row.label}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <FirmStatForm key={formKey} {...formProps} />
      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Delete "${deleteAction.pending?.label}"?`}
        description="This permanently removes the stat from the database and the Homepage. This cannot be undone."
        confirmLabel="Delete"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
