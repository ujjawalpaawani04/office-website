import { useCallback, useState } from "react";
import { FiCheckCircle, FiDatabase, FiRefreshCw, FiXCircle } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { fetchDbStatus, triggerReseed } from "../../api/dbUtilitiesApi";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Skeleton } from "../../components/Skeleton";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";

export default function DbUtilities() {
  useBreadcrumb([{ label: "Database Utilities" }]);
  const { showToast } = useToast();

  const fetcher = useCallback(() => fetchDbStatus(), []);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const [confirmReseed, setConfirmReseed] = useState(false);
  const [reseeding, setReseeding] = useState(false);

  const handleReseed = async () => {
    setReseeding(true);
    try {
      await triggerReseed();
      showToast("Seed data re-applied.");
      setConfirmReseed(false);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Reseed failed.", "error");
    } finally {
      setReseeding(false);
    }
  };

  if (error) return <ErrorState message="Could not load database status." onRetry={refetch} />;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Database Utilities" description="Diagnostic info and safe maintenance actions - not a raw SQL console." />

      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-secondary/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-secondary/50">Connection</p>
              <p className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${data.connectionOk ? "text-green-700" : "text-red-700"}`}>
                {data.connectionOk ? <FiCheckCircle className="h-4 w-4" /> : <FiXCircle className="h-4 w-4" />}
                {data.connectionOk ? "OK" : "Failed"}
              </p>
            </div>
            <div className="rounded-xl border border-secondary/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-secondary/50">Environment</p>
              <p className="mt-1 text-sm font-semibold capitalize text-secondary">{data.environment}</p>
            </div>
            <div className="rounded-xl border border-secondary/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-secondary/50">Migration Version</p>
              <p className="mt-1 font-mono text-xs font-semibold text-secondary">{data.migrationVersion}</p>
            </div>
          </div>

          <div className="rounded-xl border border-secondary/10 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-secondary">Table Row Counts</p>
              <button type="button" onClick={refetch} className="flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:underline">
                <FiRefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(data.rowCounts).map(([table, count]) => (
                <div key={table} className="flex items-center justify-between rounded-lg bg-secondary/5 px-3 py-2 text-sm">
                  <span className="text-secondary/70">{table}</span>
                  <span className="font-semibold text-secondary">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-secondary/10 bg-white p-5">
            <p className="mb-1 font-display text-sm font-semibold text-secondary">Re-run Seed Data</p>
            <p className="mb-3 text-xs text-secondary/60">
              {data.seedAllowed
                ? "Re-applies the firm's real seed content. Safe to run repeatedly - existing rows are matched by their natural key and updated in place."
                : "This action is disabled in production."}
            </p>
            <Button variant="secondary" disabled={!data.seedAllowed} onClick={() => setConfirmReseed(true)}>
              <FiDatabase className="h-4 w-4" /> Re-run Seed Data
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmReseed}
        title="Re-run the seed script?"
        description="This writes/updates real content rows. It is idempotent, but should still only be run intentionally."
        confirmLabel="Run Seed Script"
        loading={reseeding}
        onConfirm={handleReseed}
        onCancel={() => setConfirmReseed(false)}
      />
    </div>
  );
}
