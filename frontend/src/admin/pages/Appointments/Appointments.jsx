import { useCallback, useState } from "react";
import { FiCalendar } from "react-icons/fi";

import { listAppointments } from "../../api/appointmentsApi";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { SERVICE_LABELS } from "./serviceLabels";

const STATUS_OPTIONS = ["", "pending_confirmation", "confirmed", "cancelled", "completed", "failed"];

export default function Appointments() {
  useBreadcrumb([{ label: "Appointments" }]);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetcher = useCallback(
    () => listAppointments({ page, pageSize: 20, q, status, date }),
    [page, q, status, date]
  );
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  if (error) return <ErrorState message="Could not load appointments." onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Bookings submitted through the website's Book Appointment page. Calendly remains the source of truth for scheduling - this is a read/track view."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); setPage(1); }}
          placeholder="Search by name, appointment ID or mobile..."
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s ? s.replace(/_/g, " ") : "All statuses"}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        />
      </div>

      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiCalendar, title: "No appointments yet", description: "Bookings from the website will appear here." }}
        getRowId={(row) => row.id}
        columns={[
          { key: "appointmentId", label: "ID" },
          { key: "clientName", label: "Client" },
          { key: "mobileNumber", label: "Mobile" },
          { key: "service", label: "Service", render: (row) => SERVICE_LABELS[row.service] || row.service },
          {
            key: "appointmentDate",
            label: "Date & Time",
            render: (row) => `${row.appointmentDate} · ${row.appointmentTime}`,
          },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
        actions={(row) => (
          <button
            type="button"
            onClick={() => setSelectedId(row.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            View
          </button>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <AppointmentDrawer appointmentId={selectedId} onClose={() => setSelectedId(null)} onChanged={refetch} />
    </div>
  );
}
