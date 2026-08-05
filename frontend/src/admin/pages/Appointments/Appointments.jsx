import { useCallback, useMemo, useState } from "react";
import { FiCalendar, FiDownload, FiMail, FiPhoneCall, FiRefreshCw, FiTrash2, FiVideo, FiX, FiXCircle } from "react-icons/fi";

import { bulkDeleteAppointments, exportAppointments, listAppointments, syncAppointments } from "../../api/appointmentsApi";
import { useAuth } from "../../auth/useAuth";
import { ApiError } from "../../../shared/api/client";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { DateRangeFilter } from "../../components/DateRangeFilter";
import { DropdownMenu } from "../../components/DropdownMenu";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";

import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { downloadBlob } from "../../utils/downloadBlob";
import { formatAppointmentMode, getCallablePhone } from "../../utils/appointmentMode";
import { formatMeetingSchedule } from "../../utils/appointmentTime";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { AppointmentStatusFilter } from "./AppointmentStatusFilter";

// Persisted across page reloads (not just component state) so the label
// still reads "Last synced: 12 minutes ago" instead of resetting to
// nothing the next time an admin opens this page.
const LAST_SYNCED_STORAGE_KEY = "admin:appointments:lastSyncedAt";

export default function Appointments() {
  useBreadcrumb([{ label: "Appointments" }]);
  const { admin } = useAuth();
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  // { preset, from: Date, to: Date, label } | null - see
  // appointmentDatePresets.js for how presets resolve to from/to.
  const [dateFilter, setDateFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
 


  const hasActiveFilters = Boolean(q || status || dateFilter);

  // Delete Mode: row checkboxes and the selection bar only exist while
  // this is true (see DataTable's `selection` prop) - the table stays
  // checkbox-free the rest of the time, per the "clean, minimal" brief.
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetcher = useCallback(
    () =>
      listAppointments({
        page,
        pageSize: 20,
        q,
        status,
        dateFrom: dateFilter ? dateFilter.from.toISOString() : undefined,
        dateTo: dateFilter ? dateFilter.to.toISOString() : undefined,
      }),
    [page, q, status, dateFilter]
  );
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const rows = data?.items || [];
  const allOnPageSelected = rows.length > 0 && rows.every((row) => selectedIds.has(row.id));

  const exitDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds(new Set());
  };

  const toggleRow = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allOnPageSelected) {
        rows.forEach((row) => next.delete(row.id));
      } else {
        rows.forEach((row) => next.add(row.id));
      }
      return next;
    });
  };

  const selection = useMemo(
    () => (deleteMode ? { selectedIds, onToggle: toggleRow, onToggleAll: toggleAllOnPage, allSelected: allOnPageSelected } : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteMode, selectedIds, allOnPageSelected, rows]
  );

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncAppointments();
      showToast(`Sync complete: ${result.added} new appointment${result.added === 1 ? "" : "s"} added, ${result.skipped} duplicate${result.skipped === 1 ? "" : "s"} skipped.`, "success");
      const now = new Date();
     
      localStorage.setItem(LAST_SYNCED_STORAGE_KEY, now.toISOString());
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not sync appointments from Calendly.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { blob } = await exportAppointments({
        status,
        q,
        dateFrom: dateFilter ? dateFilter.from.toISOString() : undefined,
        dateTo: dateFilter ? dateFilter.to.toISOString() : undefined,
      });
      downloadBlob(blob, "appointments.csv");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not export appointments.", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    showToast("Appointments refreshed.");
  };

  const handleDateFilterChange = (next) => {
    setDateFilter(next);
    setPage(1);
  };

  const handleClearFilters = () => {
    setQ("");
    setStatus("");
    setDateFilter(null);
    setPage(1);
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const result = await bulkDeleteAppointments([...selectedIds]);
      showToast(`${result.deleted} appointment${result.deleted === 1 ? "" : "s"} deleted.`, "success");
      setConfirmingBulkDelete(false);
      exitDeleteMode();
      refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete the selected appointments.", "error");
    } finally {
      setBulkDeleting(false);
    }
  };

  const moreActions = [
    { label: "Export Appointments (CSV)", icon: FiDownload, onClick: handleExport, disabled: exporting },
    { label: "Refresh List", icon: FiRefreshCw, onClick: handleRefresh },
    ...(admin?.role === "admin"
      ? [{ label: "Delete Appointments", icon: FiTrash2, variant: "danger", onClick: () => { setDeleteMode(true); setSelectedIds(new Set()); } }]
      : []),
  ];

  if (error) return <ErrorState message="Could not load appointments." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={`Appointments${data ? ` (${data.total})` : ""}`}
        description="Consultations booked through the Appointment page's Calendly integration."
      />

      {/* Search -> Date Filter -> Status Filter -> Sync -> More Actions, in
          that order - Sync stays outside the dropdown as the one action
          that's always visible, per the brief. flex-wrap keeps each group
          intact (filters together, actions together) as the toolbar wraps
          on narrower screens instead of interleaving them. */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <SearchInput
            value={q}
            onChange={(v) => { setQ(v); setPage(1); }}
            placeholder="Search by name, email or phone..."
            className=" shrink-0"
          />
          <DateRangeFilter value={dateFilter} onChange={handleDateFilterChange} />
          <AppointmentStatusFilter value={status} onChange={(next) => { setStatus(next); setPage(1); }} />
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm font-medium text-secondary/70 transition-colors duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <FiXCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">Clear Filters</span>
            </button>
          ) : null}
        </div>

        <div className="flex gap-3">
         
          <Button variant="secondary" loading={syncing} onClick={handleSync}>
            <FiRefreshCw className={syncing ? "hidden" : "h-4 w-4"} aria-hidden="true" />
            Sync Appointments
          </Button>
          <DropdownMenu items={moreActions} />
        </div>

      </div>

      {deleteMode ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-700/20 bg-brand-50/60 px-4 py-3">
          <p className="text-sm font-semibold text-secondary">
            {selectedIds.size} appointment{selectedIds.size === 1 ? "" : "s"} selected
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={exitDeleteMode}>
              <FiX className="h-4 w-4" aria-hidden="true" />
              Cancel Selection
            </Button>
            <Button variant="danger" disabled={selectedIds.size === 0} onClick={() => setConfirmingBulkDelete(true)}>
              <FiTrash2 className="h-4 w-4" aria-hidden="true" />
              Delete Selected
            </Button>
          </div>
        </div>
      ) : null}

      <DataTable
        loading={loading}
        rows={rows}
        selection={selection}
        emptyProps={{
          icon: FiCalendar,
          title: "No appointments found",
          description: "No appointments match the current filters or have been synchronized yet.",
          action: (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button loading={syncing} onClick={handleSync}>
                <FiRefreshCw className={syncing ? "hidden" : "h-4 w-4"} aria-hidden="true" />
                Sync Appointments
              </Button>
              {hasActiveFilters ? (
                <Button variant="secondary" onClick={handleClearFilters}>
                  <FiXCircle className="h-4 w-4" aria-hidden="true" />
                  Clear Filters
                </Button>
              ) : null}
            </div>
          ),
        }}
        columns={[
          { key: "clientName", label: "Name" },
          { key: "clientEmail", label: "Email" },
          { key: "eventName", label: "Event", render: (row) => row.eventName || "-" },
          { key: "schedule", label: "Scheduled For", render: formatMeetingSchedule },
          { key: "appointmentMode", label: "Mode", render: (row) => formatAppointmentMode(row.appointmentMode) },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setSelected(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">
              View
            </button>
            {row.appointmentMode === "zoom" && row.meetingLink ? (
              <a href={row.meetingLink} target="_blank" rel="noreferrer" aria-label={`Join Zoom meeting with ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-brand-50 hover:text-brand-700">
                <FiVideo className="h-4 w-4" />
              </a>
            ) : row.appointmentMode === "phone" && getCallablePhone(row) ? (
              <a href={`tel:${getCallablePhone(row)}`} aria-label={`Call ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-brand-50 hover:text-brand-700">
                <FiPhoneCall className="h-4 w-4" />
              </a>
            ) : null}
            <a href={`mailto:${row.clientEmail}`} aria-label={`Email ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-brand-50 hover:text-brand-700">
              <FiMail className="h-4 w-4" />
            </a>
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <AppointmentDrawer appointment={selected} onClose={() => setSelected(null)} />
      <ConfirmDialog
        open={confirmingBulkDelete}
        title="Delete selected appointments?"
        description="Are you sure you want to delete the selected appointments? This action cannot be undone."
        confirmLabel="Delete"
        loading={bulkDeleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setConfirmingBulkDelete(false)}
      />
    </div>
  );
}
