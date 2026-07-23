import { useCallback, useState } from "react";
import { FiActivity, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { firmStatsApi } from "../../api/firmStatsApi";
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
import { FirmStatForm } from "./FirmStatForm";

export default function FirmStats() {
  useBreadcrumb([{ label: "Firm Stats" }]);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => firmStatsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await firmStatsApi.remove(pendingDelete.id);
      showToast("Firm stat deactivated.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not deactivate.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message="Could not load firm stats." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Firm Stats"
        description="The single source of truth for figures like years of experience or clients served - edit here, not in code."
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> Add Stat</Button>}
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
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.label}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Deactivate ${row.label}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <FirmStatForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Deactivate "${pendingDelete?.label}"?`}
        confirmLabel="Deactivate"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
