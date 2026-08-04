import { useCallback, useState } from "react";
import { FiCalendar, FiTrash2 } from "react-icons/fi";

import { deleteAppointment, listAppointments } from "../../api/appointmentsApi";
import { useAuth } from "../../auth/useAuth";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DataTable } from "../../components/DataTable";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useConfirmAction } from "../../hooks/useConfirmAction";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { AppointmentDrawer } from "./AppointmentDrawer";

const STATUS_OPTIONS = ["", "pending", "confirmed", "cancelled", "rescheduled", "completed"];

function formatSchedule(row) {
  if (!row.meetingDate) return "-";
  const date = new Date(row.meetingDate).toLocaleDateString();
  if (!row.meetingTime) return date;
  return `${date} ${row.meetingTime.slice(0, 5)}${row.timezone ? ` (${row.timezone})` : ""}`;
}

export default function Appointments() {
  useBreadcrumb([{ label: "Appointments" }]);
  const { admin } = useAuth();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const fetcher = useCallback(() => listAppointments({ page, pageSize: 20, q, status }), [page, q, status]);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const deleteAction = useConfirmAction((row) => deleteAppointment(row.id), {
    successMessage: "Appointment deleted.",
    errorMessage: "Could not delete.",
    onSuccess: refetch,
  });

  if (error) return <ErrorState message="Could not load appointments." onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Appointments" description="Consultations booked through the Appointment page's Calendly integration." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name, email, or phone..." />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s ? s.replace(/^\w/, (c) => c.toUpperCase()) : "All statuses"}</option>
          ))}
        </select>
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        emptyProps={{ icon: FiCalendar, title: "No appointments yet", description: "Bookings from the Appointment page will appear here." }}
        columns={[
          { key: "clientName", label: "Name" },
          { key: "clientEmail", label: "Email" },
          { key: "eventName", label: "Event", render: (row) => row.eventName || "-" },
          { key: "schedule", label: "Scheduled For", render: formatSchedule },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setSelected(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">
              View
            </button>
            {admin?.role === "admin" ? (
              <button type="button" onClick={() => deleteAction.request(row)} aria-label={`Delete appointment for ${row.clientName}`} className="rounded-lg p-2 text-secondary/60 hover:bg-red-50 hover:text-red-600">
                <FiTrash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
      />
      {data ? <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} /> : null}

      <AppointmentDrawer appointment={selected} onClose={() => setSelected(null)} />
      <ConfirmDialog
        open={Boolean(deleteAction.pending)}
        title={`Delete appointment for "${deleteAction.pending?.clientName}"?`}
        description="This permanently removes the appointment record from the database. This cannot be undone."
        confirmLabel="Delete"
        loading={deleteAction.busy}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.cancel}
      />
    </div>
  );
}
