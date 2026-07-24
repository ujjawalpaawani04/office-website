import { useCallback, useState } from "react";
import { FiShield, FiX } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { listFailedLogins, listSessions, revokeSession } from "../../api/securityApi";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";

export default function Security() {
  useBreadcrumb([{ label: "Security" }]);
  const { showToast } = useToast();

  const sessionsFetcher = useCallback(() => listSessions({ pageSize: 50 }), []);
  const { data: sessions, error: sessionsError, loading: sessionsLoading, refetch: refetchSessions } = useAsyncData(sessionsFetcher);

  const failedLoginsFetcher = useCallback(() => listFailedLogins({ pageSize: 20 }), []);
  const { data: failedLogins, error: failedLoginsError, loading: failedLoginsLoading } = useAsyncData(failedLoginsFetcher);

  const [pendingRevoke, setPendingRevoke] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    setRevoking(true);
    try {
      await revokeSession(pendingRevoke.id);
      showToast("Session revoked.");
      setPendingRevoke(null);
      refetchSessions();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not revoke session.", "error");
    } finally {
      setRevoking(false);
    }
  };

  if (sessionsError || failedLoginsError) {
    return <ErrorState message="Could not load security data." onRetry={refetchSessions} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Security" description="Active admin sessions and recent failed login attempts." />

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold text-secondary">Active Sessions</h2>
        <DataTable
          loading={sessionsLoading}
          rows={sessions?.items || []}
          emptyProps={{ icon: FiShield, title: "No active sessions." }}
          columns={[
            { key: "adminName", label: "Admin" },
            { key: "userAgent", label: "Device", className: "max-w-xs truncate" },
            { key: "ipAddress", label: "IP Address" },
            { key: "issuedAt", label: "Signed In", render: (row) => new Date(row.issuedAt).toLocaleString() },
          ]}
          actions={(row) => (
            <button type="button" onClick={() => setPendingRevoke(row)} aria-label="Revoke session" className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
              <FiX className="h-4 w-4" />
            </button>
          )}
        />
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold text-secondary">Recent Failed Logins</h2>
        <DataTable
          loading={failedLoginsLoading}
          rows={failedLogins?.items || []}
          emptyProps={{ icon: FiShield, title: "No failed login attempts recorded." }}
          columns={[
            { key: "email", label: "Email Attempted" },
            { key: "ipAddress", label: "IP Address" },
            { key: "createdAt", label: "When", render: (row) => new Date(row.createdAt).toLocaleString() },
          ]}
        />
      </section>

      <ConfirmDialog
        open={Boolean(pendingRevoke)}
        title="Revoke this session?"
        description="That device will be signed out immediately."
        confirmLabel="Revoke"
        loading={revoking}
        onConfirm={handleRevoke}
        onCancel={() => setPendingRevoke(null)}
      />
    </div>
  );
}
