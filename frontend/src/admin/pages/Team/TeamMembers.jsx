import { useCallback, useState } from "react";
import { FiEdit2, FiLock, FiPlus, FiSlash, FiTrash2, FiUsers } from "react-icons/fi";

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
import { useConfirmAction } from "../../hooks/useConfirmAction";
import { useDrawerForm } from "../../hooks/useDrawerForm";
import { useAuth } from "../../auth/useAuth";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { TeamMemberForm } from "./TeamMemberForm";

export default function TeamMembers() {
  useBreadcrumb([{ label: "Team Members" }]);
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const fetcher = useCallback(() => teamApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const { formKey, formProps, openCreate, openEdit } = useDrawerForm(refetch);
  const deactivateAction = useConfirmAction((row) => teamApi.remove(row.id), {
    successMessage: "Team member deactivated.",
    errorMessage: "Could not deactivate.",
    onSuccess: refetch,
  });
  const deleteAction = useConfirmAction((row) => teamApi.deletePermanent(row.id), {
    successMessage: "Team member deleted.",
    errorMessage: "Could not delete.",
    onSuccess: refetch,
  });

  if (error) {
    return <ErrorState message="Could not load team members." onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Team Members"
        description="Partner and staff bios shown on the About page."
        action={
          <Button onClick={openCreate}>
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
              onClick={() => openEdit(row)}
              aria-label={`Edit ${row.name}`}
              className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            {admin?.role === "admin" && row.isActive ? (
              <button
                type="button"
                onClick={() => deactivateAction.request(row)}
                aria-label={`Deactivate ${row.name}`}
                className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600"
              >
                <FiSlash className="h-4 w-4" />
              </button>
            ) : null}
            {admin?.role === "admin" && !row.isActive ? (
              <button
                type="button"
                onClick={() => deleteAction.request(row)}
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

      <TeamMemberForm key={formKey} {...formProps} />

      <ConfirmDialog
        open={Boolean(deactivateAction.pending)}
        title={`Deactivate ${deactivateAction.pending?.name}?`}
        description="They'll be hidden from the public About page but their record is kept. You can permanently delete it afterward if needed."
        confirmLabel="Deactivate"
        loading={deactivateAction.busy}
        onConfirm={deactivateAction.confirm}
        onCancel={deactivateAction.cancel}
      />

      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Delete ${deleteAction.pending?.name}?`}
        description="This permanently removes the team member record. This cannot be undone."
        confirmLabel="Delete"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
