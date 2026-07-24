import { useCallback, useState } from "react";
import { FiActivity, FiDownload } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { exportAuditLogs, listAuditLogs } from "../../api/auditLogApi";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { downloadBlob } from "../../utils/downloadBlob";
import { useToast } from "../../toast/useToast";

export default function AuditLog() {
  useBreadcrumb([{ label: "Audit Log" }]);
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetcher = useCallback(() => listAuditLogs({ page, pageSize: 25 }), [page]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { blob } = await exportAuditLogs();
      downloadBlob(blob, "audit_log.csv");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not export.", "error");
    } finally {
      setExporting(false);
    }
  };

  if (error) return <ErrorState message="Could not load the audit log." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Every create, update, delete, and status change made in the Admin Panel."
        action={<Button variant="secondary" onClick={handleExport} loading={exporting}><FiDownload className="h-4 w-4" /> Export CSV</Button>}
      />
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiActivity, title: "No activity recorded yet" }}
        columns={[
          { key: "createdAt", label: "Timestamp", render: (row) => new Date(row.createdAt).toLocaleString() },
          { key: "adminName", label: "Admin", render: (row) => row.adminName || "System" },
          { key: "action", label: "Action", className: "capitalize", render: (row) => row.action.replace(/_/g, " ") },
          { key: "entityType", label: "Entity", render: (row) => `${row.entityType}${row.entityId ? ` #${row.entityId}` : ""}` },
          { key: "ipAddress", label: "IP Address" },
        ]}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}
    </div>
  );
}
