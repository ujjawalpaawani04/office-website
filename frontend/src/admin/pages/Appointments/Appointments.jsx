import { useCallback, useState } from "react";
import { FiCalendar, FiDownload, FiMail, FiPhoneCall, FiRefreshCw, FiVideo, FiXCircle } from "react-icons/fi";

import { exportAppointments, getAppointmentStats, listAppointments, syncAppointments } from "../../api/appointmentsApi";
import { ApiError } from "../../../shared/api/client";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { DateRangeFilter } from "../../components/DateRangeFilter";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useRelativeTime } from "../../hooks/useRelativeTime";

import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";
import { downloadBlob } from "../../utils/downloadBlob";
import { getCallablePhone } from "../../utils/appointmentMode";
import { formatMeetingSchedule } from "../../utils/appointmentTime";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { AppointmentStatusFilter } from "./AppointmentStatusFilter";
import { AppointmentSummaryCards } from "./AppointmentSummaryCards";
import { MeetingTypeBadge } from "./MeetingTypeBadge";

// Persisted across page reloads (not just component state) so the label
// still reads "Last synced: 12 minutes ago" instead of resetting to
// nothing the next time an admin opens this page.
const LAST_SYNCED_STORAGE_KEY = "admin:appointments:lastSyncedAt";
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function readLastSyncedAt() {
  const raw = localStorage.getItem(LAST_SYNCED_STORAGE_KEY);
  return raw ? new Date(raw) : null;
}

export default function Appointments() {
  useBreadcrumb([{ label: "Appointments" }]);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  // { preset, from: Date, to: Date, label } | null - see
  // appointmentDatePresets.js for how presets resolve to from/to.
  const [dateFilter, setDateFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(readLastSyncedAt);
  const lastSyncedLabel = useRelativeTime(lastSyncedAt);

  const hasActiveFilters = Boolean(q || status || dateFilter);

  const fetcher = useCallback(
    () =>
      listAppointments({
        page,
        pageSize,
        q,
        status,
        dateFrom: dateFilter ? dateFilter.from.toISOString() : undefined,
        dateTo: dateFilter ? dateFilter.to.toISOString() : undefined,
      }),
    [page, pageSize, q, status, dateFilter]
  );
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  // Separate from the (filtered, paginated) list fetch above - the summary
  // cards are meant to read as "the whole dataset at a glance" (see
  // getAppointmentStats), so they don't refetch when q/status/dateFilter
  // change, only after a sync actually changes the data.
  const statsFetcher = useCallback(() => getAppointmentStats(), []);
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useAsyncData(statsFetcher);

  const rows = data?.items || [];

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncAppointments();
      showToast(`Sync complete: ${result.added} new appointment${result.added === 1 ? "" : "s"} added, ${result.skipped} duplicate${result.skipped === 1 ? "" : "s"} skipped.`, "success");
      const now = new Date();
      localStorage.setItem(LAST_SYNCED_STORAGE_KEY, now.toISOString());
      setLastSyncedAt(now);
      refetch();
      refetchStats();
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

  const handlePageSizeChange = (nextSize) => {
    setPageSize(nextSize);
    setPage(1);
  };

  if (error) return <ErrorState message="Could not load appointments." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            Appointments
            {data ? (
              <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                {data.total} Total
              </span>
            ) : null}
          </span>
        }
        description="Consultations booked through the Appointment page's Calendly integration."
        action={
          <div className="flex w-full flex-wrap items-start gap-3 sm:w-auto">
            <Button variant="secondary" className="flex-1 sm:flex-none" loading={exporting} onClick={handleExport}>
              <FiDownload className={exporting ? "hidden" : "h-4 w-4"} aria-hidden="true" />
              Export CSV
            </Button>
            <div className="flex flex-col gap-2">
              <Button className="flex-1 sm:flex-none" loading={syncing} onClick={handleSync}>
                <FiRefreshCw className={syncing ? "hidden" : "h-4 w-4"} aria-hidden="true" />
                Sync Appointments
              </Button>
              {lastSyncedAt ? (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-secondary">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                  Last synced: {lastSyncedLabel}
                </span>
              ) : null}
            </div>
          </div>
        }
      />

      <AppointmentSummaryCards stats={stats} loading={statsLoading} />

      {/* Search -> Date Filter -> Status Filter -> Clear Filters, in that
          order - flex-wrap keeps the group intact as the toolbar wraps on
          narrower screens instead of interleaving them. */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); setPage(1); }}
          placeholder="Search by client name or email..."
          className="w-full sm:w-auto sm:max-w-60 sm:shrink-0"
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

      <DataTable
        loading={loading}
        rows={rows}
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
          {
            key: "clientName",
            label: "Client",
            render: (row) => (
              <div className="flex items-center gap-3">
                <Avatar name={row.clientName} />
                <span className="font-medium text-secondary">{row.clientName}</span>
              </div>
            ),
          },
          { key: "clientEmail", label: "Email" },
          { key: "eventName", label: "Event", render: (row) => row.eventName || "-" },
          { key: "schedule", label: "Date & Time", render: formatMeetingSchedule },
          { key: "appointmentMode", label: "Meeting Type", render: (row) => <MeetingTypeBadge mode={row.appointmentMode} /> },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setSelected(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">
              View
            </button>
            {row.appointmentMode === "zoom" && row.meetingLink ? (
              <a href={row.meetingLink} target="_blank" rel="noreferrer" aria-label={`Join Zoom meeting with ${row.clientName}`} className="rounded-full bg-blue-50 p-2 text-blue-700 hover:bg-blue-100">
                <FiVideo className="h-4 w-4" />
              </a>
            ) : row.appointmentMode === "phone" && getCallablePhone(row) ? (
              <a href={`tel:${getCallablePhone(row)}`} aria-label={`Call ${row.clientName}`} className="rounded-full bg-green-50 p-2 text-green-700 hover:bg-green-100">
                <FiPhoneCall className="h-4 w-4" />
              </a>
            ) : null}
            <a href={`mailto:${row.clientEmail}`} aria-label={`Email ${row.clientName}`} className="rounded-full bg-brand-50 p-2 text-brand-700 hover:bg-brand-100">
              <FiMail className="h-4 w-4" />
            </a>
          </div>
        )}
      />
      {data ? (
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}

      <AppointmentDrawer appointment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
