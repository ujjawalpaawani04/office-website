import { useCallback, useState } from "react";
import { FiDownload, FiMail, FiTrash2, FiUserCheck, FiUserX } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { deleteSubscriber, exportNewsletterSubscribers, listNewsletterSubscribers, subscribeSubscriber, unsubscribeSubscriber } from "../../api/newsletterAdminApi";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { downloadBlob } from "../../utils/downloadBlob";
import { useToast } from "../../toast/useToast";

export default function Newsletter() {
  useBreadcrumb([{ label: "Newsletter" }]);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [pendingUnsubscribe, setPendingUnsubscribe] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [subscribingId, setSubscribingId] = useState(null);

  const fetcher = useCallback(() => listNewsletterSubscribers({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      await unsubscribeSubscriber(pendingUnsubscribe.id);
      showToast("Subscriber unsubscribed.");
      setPendingUnsubscribe(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not unsubscribe.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubscribe = async (row) => {
    setSubscribingId(row.id);
    try {
      await subscribeSubscriber(row.id);
      showToast("Subscriber resubscribed.");
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not subscribe.", "error");
    } finally {
      setSubscribingId(null);
    }
  };

  const handleDelete = async () => {
    setProcessing(true);
    try {
      await deleteSubscriber(pendingDelete.id);
      showToast("Subscriber deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete subscriber.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { blob } = await exportNewsletterSubscribers();
      downloadBlob(blob, "newsletter_subscribers.csv");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not export.", "error");
    } finally {
      setExporting(false);
    }
  };

  if (error) return <ErrorState message="Could not load subscribers." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Subscribers from the blog newsletter signup."
        action={<Button variant="secondary" onClick={handleExport} loading={exporting}><FiDownload className="h-4 w-4" /> Export CSV</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by email..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiMail, title: "No subscribers yet" }}
        columns={[
          { key: "email", label: "Email" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "subscribedAt", label: "Subscribed", render: (row) => (row.subscribedAt ? new Date(row.subscribedAt).toLocaleDateString() : "-") },
        ]}
        actions={(row) => (
          row.status === "subscribed" ? (
            <button type="button" onClick={() => setPendingUnsubscribe(row)} aria-label={`Unsubscribe ${row.email}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
              <FiUserX className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => handleSubscribe(row)}
                disabled={subscribingId === row.id}
                aria-label={`Subscribe ${row.email}`}
                className="rounded-lg p-2 text-secondary/60 hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiUserCheck className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.email}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          )
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <ConfirmDialog
        open={Boolean(pendingUnsubscribe)}
        title={`Unsubscribe ${pendingUnsubscribe?.email}?`}
        description="They'll stop receiving newsletter emails but can be deleted afterward if needed."
        confirmLabel="Unsubscribe"
        loading={processing}
        onConfirm={handleUnsubscribe}
        onCancel={() => setPendingUnsubscribe(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.email}?`}
        description="This permanently removes the subscriber record. This cannot be undone."
        confirmLabel="Delete"
        loading={processing}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
