import { useCallback, useState } from "react";
import { FiEdit2, FiKey, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";

import { usersApi } from "../../api/usersApi";
import { useAuth } from "../../auth/useAuth";
import { ActiveBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useConfirmAction } from "../../hooks/useConfirmAction";
import { useDrawerForm } from "../../hooks/useDrawerForm";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { UserForm } from "./UserForm";

export default function Users() {
  useBreadcrumb([{ label: "Users" }]);
  const { admin: currentAdmin } = useAuth();

  const [page, setPage] = useState(1);

  const fetcher = useCallback(() => usersApi.list({ page, pageSize: 20 }), [page]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const { formKey, formProps, openCreate, openEdit } = useDrawerForm(refetch);
  const deleteAction = useConfirmAction((row) => usersApi.remove(row.id), {
    successMessage: "User removed.",
    errorMessage: "Could not remove user.",
    onSuccess: refetch,
  });
  const resetAction = useConfirmAction((row) => usersApi.resetPassword(row.id), {
    successMessage: "Password reset email sent.",
    errorMessage: "Could not reset password.",
  });

  if (error) return <ErrorState message="Could not load users." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Users"
        description="Admin Panel accounts and roles."
        action={<Button onClick={openCreate}><FiPlus className="h-4 w-4" /> Invite User</Button>}
      />
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiUsers, title: "No users yet" }}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role", className: "capitalize" },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
          { key: "lastLoginAt", label: "Last Login", render: (row) => (row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : "Never") },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => resetAction.request(row)} aria-label={`Reset password for ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiKey className="h-4 w-4" />
            </button>
            {row.id !== currentAdmin?.id ? (
              <button type="button" onClick={() => deleteAction.request(row)} aria-label={`Remove ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <UserForm key={formKey} {...formProps} />
      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Remove ${deleteAction.pending?.name}?`}
        description="They will immediately lose access to the Admin Panel."
        confirmLabel="Remove"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
      <ConfirmDialog
        open={Boolean(resetAction.pending)}
        title={`Reset password for ${resetAction.pending?.name}?`}
        description="A new temporary password will be emailed to them, and their other sessions will be logged out."
        confirmLabel="Reset Password"
        danger={false}
        loading={resetAction.busy}
        onConfirm={resetAction.confirm}
        onCancel={resetAction.cancel}
      />
    </div>
  );
}
