import { useCallback, useState } from "react";
import { FiEdit2, FiLock, FiPlus, FiSlash, FiTrash2, FiUsers } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { teamApi } from "../../api/teamApi";
import { ActiveBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuth } from "../../auth/useAuth";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { TeamMemberForm } from "./TeamMemberForm";

export default function TeamMembers() {
  useBreadcrumb([{ label: "Team Members" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null); // null | "create" | member object
  const [pendingDeactivate, setPendingDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => teamApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await teamApi.remove(pendingDeactivate.id);
      showToast("Team member deactivated.");
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
      await teamApi.deletePermanent(pendingDelete.id);
      showToast("Team member deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return <ErrorState message="Could not load team members." onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Team Members"
        description="Partner and staff bios shown on the About page."
        action={
          <Button onClick={() => setFormState("create")}>
            <FiPlus className="h-4 w-4" /> Add Team Member
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name or designation..." />
      </div>

      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{
          icon: FiUsers,
          title: "No team members yet",
          description: "Add your first partner or staff member.",
        }}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (row) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary/10">
                  {row.photoUrl ? <img src={row.photoUrl} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <span className="font-medium text-secondary">{row.name}</span>
                {row.isProtected ? (
                  <span
                    title="This member's position is pinned first and can't be reordered."
                    className="inline-flex items-center gap-1 rounded-full bg-brand-700/10 px-2 py-0.5 text-[11px] font-medium text-brand-700"
                  >
                    <FiLock className="h-3 w-3" /> Position locked
                  </span>
                ) : null}
              </div>
            ),
          },
          { key: "designation", label: "Designation" },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setFormState(row)}
              aria-label={`Edit ${row.name}`}
              className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            {admin?.role === "admin" && row.isActive ? (
              <button
                type="button"
                onClick={() => setPendingDeactivate(row)}
                aria-label={`Deactivate ${row.name}`}
                className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600"
              >
                <FiSlash className="h-4 w-4" />
              </button>
            ) : null}
            {admin?.role === "admin" && !row.isActive ? (
              <button
                type="button"
                onClick={() => setPendingDelete(row)}
                aria-label={`Delete ${row.name}`}
                className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <TeamMemberForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => {
          setFormState(null);
          refetch();
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDeactivate)}
        title={`Deactivate ${pendingDeactivate?.name}?`}
        description="They'll be hidden from the public About page but their record is kept. You can permanently delete it afterward if needed."
        confirmLabel="Deactivate"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setPendingDeactivate(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.name}?`}
        description="This permanently removes the team member record. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
