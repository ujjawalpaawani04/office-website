import { FiAlertCircle, FiEdit2 } from "react-icons/fi";
import { APPOINTMENT_SERVICES, MEETING_MODES } from "../appointmentServices";

const formatDate = (iso) => {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T00:00:00`));
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-brand-700/10 py-3 last:border-b-0">
    <span className="text-sm text-black/60">{label}</span>
    <span className="text-sm font-semibold text-black">{value}</span>
  </div>
);

export const SummaryStep = ({ selection, details, onEdit, onConfirm, isSubmitting, submitError }) => {
  const service = APPOINTMENT_SERVICES.find((s) => s.key === selection.service);
  const mode = MEETING_MODES.find((m) => m.key === selection.mode);

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
        Review Your Appointment
      </h3>

      <div className="rounded-2xl border border-brand-700/10 bg-brand-50/40 p-6">
        <Row label="Client Name" value={details.name} />
        <Row label="Service" value={service?.label || selection.service} />
        <Row label="Mode" value={mode?.label || selection.mode} />
        <Row label="Date" value={formatDate(selection.date)} />
        <Row label="Time" value={selection.time?.label || "-"} />
        <Row
          label="Status"
          value={<span className="rounded-full bg-brand-700/10 px-2.5 py-0.5 text-xs font-bold text-brand-700">Ready to Confirm</span>}
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-black/50">
        Duration and any consultation fee are confirmed on the next screen, where you'll complete scheduling
        securely through our calendar system.
      </p>

      {submitError && (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {submitError}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting…
            </>
          ) : (
            "Confirm Appointment"
          )}
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md border border-brand-700/30 px-5 py-3.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiEdit2 className="h-3.5 w-3.5" aria-hidden="true" />
          Edit Details
        </button>
      </div>
    </div>
  );
};
