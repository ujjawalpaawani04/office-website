import { useEffect, useState } from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { downloadAppointmentDocument, getAppointment, updateAppointment } from "../../api/appointmentsApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { SelectField, TextAreaField } from "../../components/form/Field";
import { StatusBadge } from "../../components/StatusBadge";
import { downloadBlob } from "../../utils/downloadBlob";
import { useToast } from "../../toast/useToast";
import { SERVICE_LABELS } from "./serviceLabels";

const STATUS_OPTIONS = ["pending_confirmation", "confirmed", "cancelled", "completed", "failed"];

export function AppointmentDrawer({ appointmentId, onClose, onChanged }) {
  const { showToast } = useToast();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setAppointment(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getAppointment(appointmentId)
      .then((data) => {
        if (cancelled) return;
        setAppointment(data);
        setStatus(data.status);
        setNotes(data.internalNotes || "");
      })
      .catch((err) => {
        if (!cancelled) showToast(err instanceof ApiError ? err.message : "Could not load appointment.", "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  if (!appointmentId) return null;

  const handleStatusChange = async (value) => {
    setStatus(value);
    setSavingStatus(true);
    try {
      const updated = await updateAppointment(appointmentId, { status: value });
      setAppointment(updated);
      showToast("Status updated.");
      onChanged();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update status.", "error");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const updated = await updateAppointment(appointmentId, { internalNotes: notes });
      setAppointment(updated);
      showToast("Notes saved.");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not save notes.", "error");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { blob, filename } = await downloadAppointmentDocument(appointmentId);
      downloadBlob(blob, filename || appointment.documentFilename || "document");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not download document.", "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Drawer open={Boolean(appointmentId)} title="Appointment Details" onClose={onClose}>
      {loading || !appointment ? (
        <p className="text-sm text-secondary/60">Loading…</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-secondary">{appointment.clientName}</p>
              <p className="text-sm text-secondary/60">
                {appointment.email} &middot; {appointment.mobileNumber}
              </p>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-secondary/5 p-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase text-secondary/40">Appointment ID</dt>
              <dd className="text-secondary">{appointment.appointmentId}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-secondary/40">Service</dt>
              <dd className="text-secondary">{SERVICE_LABELS[appointment.service] || appointment.service}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-secondary/40">Meeting Mode</dt>
              <dd className="capitalize text-secondary">{appointment.meetingMode}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-secondary/40">Date & Time</dt>
              <dd className="text-secondary">{appointment.appointmentDate} · {appointment.appointmentTime}</dd>
            </div>
            {appointment.durationMinutes ? (
              <div>
                <dt className="text-xs font-semibold uppercase text-secondary/40">Duration</dt>
                <dd className="text-secondary">{appointment.durationMinutes} min</dd>
              </div>
            ) : null}
            {appointment.businessName ? (
              <div>
                <dt className="text-xs font-semibold uppercase text-secondary/40">Business</dt>
                <dd className="text-secondary">{appointment.businessName}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-semibold uppercase text-secondary/40">Existing Client</dt>
              <dd className="text-secondary">{appointment.isExistingClient ? "Yes" : "No"}</dd>
            </div>
            {appointment.alternateContact ? (
              <div>
                <dt className="text-xs font-semibold uppercase text-secondary/40">Alternate Contact</dt>
                <dd className="text-secondary">{appointment.alternateContact}</dd>
              </div>
            ) : null}
          </dl>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary/70">Requirement</p>
            <p className="rounded-lg bg-secondary/5 p-3 text-sm text-secondary/80">{appointment.requirementDescription}</p>
          </div>

          {(appointment.meetingLink || appointment.cancelUrl || appointment.rescheduleUrl) && (
            <div className="space-y-2 rounded-lg border border-brand-700/15 bg-brand-50/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary/70">Calendly Links</p>
              {appointment.meetingLink && (
                <a href={appointment.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline">
                  <FiExternalLink className="h-3.5 w-3.5" /> Meeting Link
                </a>
              )}
              {appointment.rescheduleUrl && (
                <a href={appointment.rescheduleUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline">
                  <FiExternalLink className="h-3.5 w-3.5" /> Reschedule URL
                </a>
              )}
              {appointment.cancelUrl && (
                <a href={appointment.cancelUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline">
                  <FiExternalLink className="h-3.5 w-3.5" /> Cancel URL
                </a>
              )}
            </div>
          )}

          {appointment.hasDocument && (
            <Button variant="secondary" onClick={handleDownload} loading={downloading} className="w-full">
              <FiDownload className="h-4 w-4" /> Download Document ({appointment.documentFilename})
            </Button>
          )}

          <SelectField id="appt-status" label="Status" value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={savingStatus}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </SelectField>

          <TextAreaField
            id="appt-notes"
            label="Internal Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <Button variant="secondary" onClick={handleSaveNotes} loading={savingNotes} className="w-full">
            Save Notes
          </Button>
        </div>
      )}
    </Drawer>
  );
}
