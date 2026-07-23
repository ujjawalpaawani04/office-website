import { useState } from "react";

import { ApiError } from "../../../api/client";
import { updateEnquiryStatus } from "../../api/enquiriesApi";
import { SelectField } from "../../components/form/Field";
import { Drawer } from "../../components/Drawer";
import { useToast } from "../../toast/useToast";

const STATUS_OPTIONS = ["new", "in_progress", "resolved"];

export function EnquiryDrawer({ enquiry, onClose, onChanged }) {
  const { showToast } = useToast();
  const [status, setStatus] = useState(enquiry?.status || "new");
  const [saving, setSaving] = useState(false);

  if (!enquiry) return null;

  const handleStatusChange = async (value) => {
    setStatus(value);
    setSaving(true);
    try {
      await updateEnquiryStatus(enquiry.id, value);
      showToast("Status updated.");
      onChanged();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update status.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={Boolean(enquiry)} title="Enquiry Details" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-lg font-semibold text-secondary">{enquiry.name}</p>
          <p className="text-sm text-secondary/60">
            <a href={`mailto:${enquiry.email}`} className="hover:underline">{enquiry.email}</a> &middot; {enquiry.phone}
          </p>
        </div>

        {enquiry.service ? (
          <div className="rounded-lg bg-secondary/5 p-3 text-sm">
            <p className="text-xs font-semibold uppercase text-secondary/40">Service Interested In</p>
            <p className="text-secondary">{enquiry.service}</p>
          </div>
        ) : null}

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary/70">Message</p>
          <p className="rounded-lg bg-secondary/5 p-3 text-sm text-secondary/80">{enquiry.message}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs text-secondary/50">
          <div>
            <dt className="font-semibold text-secondary/40">Submitted</dt>
            <dd>{new Date(enquiry.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-semibold text-secondary/40">IP Address</dt>
            <dd>{enquiry.ipAddress || "-"}</dd>
          </div>
        </dl>

        <SelectField id="enq-status" label="Status" value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={saving}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}</option>
          ))}
        </SelectField>

        <a
          href={`mailto:${enquiry.email}`}
          className="block w-full rounded-lg bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-800"
        >
          Reply via Email
        </a>
      </div>
    </Drawer>
  );
}
