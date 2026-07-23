import { useCallback, useState } from "react";
import { FiEdit2, FiMessageSquare, FiPlus, FiSlash, FiStar, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { testimonialsApi } from "../../api/testimonialsApi";
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
import { TestimonialForm } from "./TestimonialForm";

export default function Testimonials() {
  useBreadcrumb([{ label: "Testimonials" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [pendingDeactivate, setPendingDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => testimonialsApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await testimonialsApi.remove(pendingDeactivate.id);
      showToast("Testimonial deactivated.");
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
      await testimonialsApi.deletePermanent(pendingDelete.id);
      showToast("Testimonial deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message="Could not load testimonials." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Client reviews shown on the homepage."
        action={
          <Button onClick={() => setFormState("create")}>
            <FiPlus className="h-4 w-4" /> Add Testimonial
          </Button>
        }
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by client name..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiMessageSquare, title: "No testimonials yet" }}
        columns={[
          { key: "clientName", label: "Client", render: (row) => (
            <div>
              <p className="font-medium text-secondary">{row.clientName}</p>
              <p className="text-xs text-secondary/50">{row.clientCompany}</p>
            </div>
          ) },
          { key: "rating", label: "Rating", render: (row) => (
            <span className="flex items-center gap-1 text-gold-500">
              <FiStar className="h-3.5 w-3.5" /> {row.rating ?? "-"}
            </span>
          ) },
          { key: "isFeatured", label: "Featured", render: (row) => (row.isFeatured ? <ActiveBadge active /> : <span className="text-secondary/30">-</span>) },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {row.isActive ? (
              <button type="button" onClick={() => setPendingDeactivate(row)} aria-label={`Deactivate ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiSlash className="h-4 w-4" />
              </button>
            ) : admin?.role === "admin" ? (
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete testimonial from ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <TestimonialForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
      />
      <ConfirmDialog
        open={Boolean(pendingDeactivate)}
        title={`Deactivate testimonial from ${pendingDeactivate?.clientName}?`}
        description="It will be hidden from the homepage. You can permanently delete it afterward if needed."
        confirmLabel="Deactivate"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setPendingDeactivate(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete testimonial from ${pendingDelete?.clientName}?`}
        description="This permanently removes the testimonial. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
