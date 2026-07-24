import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { servicesApi } from "../../api/servicesApi";
import { useAuth } from "../../auth/useAuth";
import { ActiveBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { SearchInput } from "../../components/SearchInput";
import { SortableRepeater } from "../../components/SortableRepeater";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { useToast } from "../../toast/useToast";

const CATEGORY_LABELS = {
  our_services: "Our Services",
  corporate_specialised: "Corporate & Specialised Services",
};
const CATEGORY_ORDER = ["our_services", "corporate_specialised"];

export default function Services() {
  useBreadcrumb([{ label: "Services" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Reordering only makes sense against the full, unfiltered, per-category
  // list - pageSize is large since service counts stay small by nature
  // (per docs/02-Admin-Panel-Planning.md §11) so this never needs real
  // pagination in practice.
  const fetcher = useCallback(() => servicesApi.list({ page: 1, pageSize: 200, q }), [q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await servicesApi.remove(pendingDelete.id);
      showToast("Service deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleReorder = async (category, reorderedRows) => {
    const payload = reorderedRows.map((row, index) => ({ id: row.id, sortOrder: index }));
    setReordering(true);
    try {
      await servicesApi.reorder(payload);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not save the new order.", "error");
    } finally {
      setReordering(false);
    }
  };

  if (error) return <ErrorState message="Could not load services." onRetry={refetch} />;

  const items = data?.items || [];
  const isSearching = q.trim().length > 0;

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage every service page shown on the site - content, images, icons, SEO, and where it appears in the header/sidebar."
        action={<Button onClick={() => navigate("/admin/services/new")}><FiPlus className="h-4 w-4" /> Add Service</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search by name..." />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={FiBriefcase} title="No services yet" />
      ) : isSearching ? (
        <DataTable
          loading={false}
          rows={items}
          emptyProps={{ icon: FiBriefcase, title: "No services match your search" }}
          columns={[
            { key: "name", label: "Name" },
            { key: "category", label: "Category", render: (row) => CATEGORY_LABELS[row.category] || row.category },
            { key: "slug", label: "Slug", render: (row) => <code className="text-xs text-secondary/60">{row.slug}</code> },
            { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
          ]}
          actions={(row) => <RowActions row={row} admin={admin} navigate={navigate} onDelete={setPendingDelete} />}
        />
      ) : (
        <div className="space-y-8">
          {CATEGORY_ORDER.map((category) => {
            const rows = items
              .filter((row) => row.category === category)
              .sort((a, b) => a.sortOrder - b.sortOrder);
            if (rows.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary/70">
                  {CATEGORY_LABELS[category]}
                </h2>
                <SortableRepeater
                  items={rows.map((row) => ({ ...row, id: row.id }))}
                  onReorder={(reordered) => handleReorder(category, reordered)}
                  renderItem={(row) => (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-secondary">{row.name}</p>
                        <code className="text-xs text-secondary/50">{row.slug}</code>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <ActiveBadge active={row.isActive} />
                        <RowActions row={row} admin={admin} navigate={navigate} onDelete={setPendingDelete} />
                      </div>
                    </div>
                  )}
                />
              </div>
            );
          })}
          {reordering ? <p className="mt-2 text-xs text-secondary/50">Saving new order...</p> : null}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This removes it from the public site entirely."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function RowActions({ row, admin, navigate, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => navigate(`/admin/services/${row.id}`)}
        aria-label={`Edit ${row.name}`}
        className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
      >
        <FiEdit2 className="h-4 w-4" />
      </button>
      {admin?.role === "admin" ? (
        <button
          type="button"
          onClick={() => onDelete(row)}
          aria-label={`Delete ${row.name}`}
          className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
