import { useCallback, useState } from "react";
import { FiDownload, FiMail, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { deleteEnquiry, exportEnquiries, listEnquiries } from "../../api/enquiriesApi";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { downloadBlob } from "../../utils/downloadBlob";
import { useToast } from "../../toast/useToast";
import { EnquiryDrawer } from "./EnquiryDrawer";

const STATUS_OPTIONS = ["", "new", "in_progress", "resolved"];

export default function Enquiries() {
  useBreadcrumb([{ label: "Enquiries" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => listEnquiries({ page, pageSize: 20, q, status }), [page, q, status]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { blob } = await exportEnquiries({ status });
      downloadBlob(blob, "enquiries.csv");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not export.", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEnquiry(pendingDelete.id);
      showToast("Enquiry deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message="Could not load enquiries." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Enquiries"
        description="Submissions from the Contact page and homepage form."
        action={<Button variant="secondary" onClick={handleExport} loading={exporting}><FiDownload className="h-4 w-4" /> Export CSV</Button>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name, email, or phone..." />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s ? s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase()) : "All statuses"}</option>
          ))}
        </select>
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiMail, title: "No enquiries yet", description: "Submissions from the Contact page will appear here." }}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "service", label: "Service" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "createdAt", label: "Submitted", render: (row) => new Date(row.createdAt).toLocaleDateString() },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setSelected(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">
              View
            </button>
            {admin?.role === "admin" ? (
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete enquiry from ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <EnquiryDrawer enquiry={selected} onClose={() => setSelected(null)} onChanged={refetch} />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete enquiry from "${pendingDelete?.name}"?`}
        description="This permanently removes the enquiry record. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
