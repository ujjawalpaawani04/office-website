import { useCallback, useState } from "react";
import { FiAward, FiEdit2, FiPlus, FiSlash, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { certificationsApi } from "../../api/certificationsApi";
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
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { CertificationForm } from "./CertificationForm";

export default function Certifications() {
  useBreadcrumb([{ label: "Certifications" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [pendingDeactivate, setPendingDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => certificationsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await certificationsApi.remove(pendingDeactivate.id);
      showToast("Certification deactivated.");
      setPendingDeactivate(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not deactivate.", "error");
    } finally {
      setDeactivating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await certificationsApi.deletePermanent(pendingDelete.id);
      showToast("Certification deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message="Could not load certifications." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Certifications"
        description="ICAI/ISO/Udyam-style badges shown on the About page."
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> Add Certification</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiAward, title: "No certifications yet" }}
        columns={[
          { key: "name", label: "Name" },
          { key: "issuingBody", label: "Issuing Body" },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {row.isActive ? (
              <button type="button" onClick={() => setPendingDeactivate(row)} aria-label={`Deactivate ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiSlash className="h-4 w-4" />
              </button>
            ) : admin?.role === "admin" ? (
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <CertificationForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
      />
      <ConfirmDialog
        open={Boolean(pendingDeactivate)}
        title={`Deactivate "${pendingDeactivate?.name}"?`}
        description="It will be hidden from the public About page. You can permanently delete it afterward if needed."
        confirmLabel="Deactivate"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setPendingDeactivate(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This permanently removes the certification. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
