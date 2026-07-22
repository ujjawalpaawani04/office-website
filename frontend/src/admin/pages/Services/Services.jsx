import { useCallback, useState } from "react";
import { FiBriefcase, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { describeSendResult, sendNewsletter } from "../../api/newsletterAdminApi";
import { servicesApi } from "../../api/servicesApi";
import { useAuth } from "../../auth/useAuth";
import { ActiveBadge } from "../../components/StatusBadge";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { NewsletterRecommendationModal } from "../../components/NewsletterRecommendationModal";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { ServiceForm } from "./ServiceForm";

export default function Services() {
  useBreadcrumb([{ label: "Services" }]);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [formState, setFormState] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const fetcher = useCallback(() => servicesApi.list({ page, pageSize: 20, q }), [page, q]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const handleSendNewsletter = async () => {
    setSendingNewsletter(true);
    try {
      const result = await sendNewsletter(suggestion);
      showToast(describeSendResult(result), result.successCount > 0 ? "success" : "error");
      setSuggestion(null);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not send the newsletter.", "error");
    } finally {
      setSendingNewsletter(false);
    }
  };

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

  if (error) return <ErrorState message="Could not load services." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Services"
        description="Core service-line metadata shown on each service page."
        action={<Button onClick={() => setFormState("create")}><FiPlus className="h-4 w-4" /> Add Service</Button>}
      />
      <div className="mb-4">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name..." />
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiBriefcase, title: "No services yet" }}
        columns={[
          { key: "name", label: "Name" },
          { key: "slug", label: "Slug", render: (row) => <code className="text-xs text-secondary/60">{row.slug}</code> },
          { key: "isActive", label: "Status", render: (row) => <ActiveBadge active={row.isActive} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setFormState(row)} aria-label={`Edit ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-secondary/5 hover:text-secondary">
              <FiEdit2 className="h-4 w-4" />
            </button>
            {admin?.role === "admin" ? (
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.name}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <ServiceForm
        key={formState === "create" ? "create" : formState?.id ?? "closed"}
        open={Boolean(formState)}
        initial={formState === "create" ? null : formState}
        onClose={() => setFormState(null)}
        onSaved={() => { setFormState(null); refetch(); }}
        onSuggestion={setSuggestion}
      />
      <NewsletterRecommendationModal
        open={Boolean(suggestion)}
        suggestion={suggestion}
        sending={sendingNewsletter}
        onSend={handleSendNewsletter}
        onSkip={() => setSuggestion(null)}
      />
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
