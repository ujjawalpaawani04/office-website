import { useCallback, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { TaxonomyForm } from "./TaxonomyForm";

// Shared list page for Blog Categories/Tags/Authors (see TaxonomyForm for
// why these three are handled generically rather than duplicated).
export function TaxonomyList({ api, title, description, icon, entityName, addLabel, fields, extraColumns = [] }) {
  useBreadcrumb([{ label: title }]);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetcher = useCallback(() => api.list({ page, pageSize: 20, q }), [api, page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.remove(pendingDelete.id);
      showToast(`${entityName} deleted.`);
      setPendingDelete(null);
      refetch();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Could not delete.");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message={`Could not load ${title.toLowerCase()}.`} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> {addLabel}</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon, title: `No ${title.toLowerCase()} yet` }}
        columns={[{ key: "name", label: "Name" }, { key: "slug", label: "Slug", render: (row) => <code className="text-xs text-secondary/60">{row.slug}</code> }, ...extraColumns]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => { setPendingDelete(row); setDeleteError(null); }} aria-label={`Delete ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <TaxonomyForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
        api={api}
        entityName={entityName}
        fields={fields}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name}"?`}
        description={deleteError || "This cannot be undone."}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
