import { useCallback, useState } from "react";
import { FiEdit2, FiKey, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";

import { ApiError } from "../../../api/client";
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
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { UserForm } from "./UserForm";

export default function Users() {
  useBreadcrumb([{ label: "Users" }]);
  const { showToast } = useToast();
  const { admin: currentAdmin } = useAuth();

  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingReset, setPendingReset] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetcher = useCallback(() => usersApi.list({ page, pageSize: 20 }), [page]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleDelete = async () => {
    setBusy(true);
    try {
      await usersApi.remove(pendingDelete.id);
      showToast("User removed.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not remove user.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    try {
      await usersApi.resetPassword(pendingReset.id);
      showToast("Password reset email sent.");
      setPendingReset(null);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not reset password.", "error");
    } finally {
      setBusy(false);
    }
  };

  if (error) return <ErrorState message="Could not load users." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Users"
        description="Admin Panel accounts and roles."
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> Invite User</Button>}
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
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setPendingReset(row)} aria-label={`Reset password for ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiKey className="h-4 w-4" />
            </button>
            {row.id !== currentAdmin?.id ? (
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Remove ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <UserForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Remove ${pendingDelete?.name}?`}
        description="They will immediately lose access to the Admin Panel."
        confirmLabel="Remove"
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingReset)}
        title={`Reset password for ${pendingReset?.name}?`}
        description="A new temporary password will be emailed to them, and their other sessions will be logged out."
        confirmLabel="Reset Password"
        danger={false}
        loading={busy}
        onConfirm={handleReset}
        onCancel={() => setPendingReset(null)}
      />
    </div>
  );
}
