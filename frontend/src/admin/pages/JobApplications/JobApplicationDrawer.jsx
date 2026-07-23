import { useState } from "react";
import { FiDownload, FiTrash2 } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { deleteJobApplication, downloadResume, updateJobApplicationStatus } from "../../api/jobApplicationsApi";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Drawer } from "../../components/Drawer";
import { SelectField } from "../../components/form/Field";
import { downloadBlob } from "../../utils/downloadBlob";
import { useToast } from "../../toast/useToast";

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected", "hired"];

export function JobApplicationDrawer({ application, onClose, onChanged }) {
  const { showToast } = useToast();
  const { admin } = useAuth();
  const [status, setStatus] = useState(application?.status || "new");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!application) return null;

  const handleStatusChange = async (value) => {
    setStatus(value);
    setSaving(true);
    try {
      await updateJobApplicationStatus(application.id, value);
      showToast("Status updated.");
      onChanged();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update status.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { blob, filename } = await downloadResume(application.id);
      downloadBlob(blob, filename || application.resumeFilename || "resume");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not download résumé.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteJobApplication(application.id);
      showToast("Application deleted.");
      setConfirmDelete(false);
      onChanged();
      onClose();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Drawer open={Boolean(application)} title="Application Details" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-lg font-semibold text-secondary">{application.name}</p>
          <p className="text-sm text-secondary/60">{application.email} &middot; {application.phone}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-lg bg-secondary/5 p-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-secondary/40">Position</dt>
            <dd className="text-secondary">{application.positionAppliedFor || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-secondary/40">Experience</dt>
            <dd className="text-secondary">{application.experience || "-"}</dd>
          </div>
        </dl>

        {application.message ? (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secondary/70">Message</p>
            <p className="rounded-lg bg-secondary/5 p-3 text-sm text-secondary/80">{application.message}</p>
          </div>
        ) : null}

        <SelectField id="ja-status" label="Status" value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={saving}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </SelectField>

        <Button variant="secondary" onClick={handleDownload} loading={downloading} className="w-full">
          <FiDownload className="h-4 w-4" /> Download Résumé ({application.resumeFilename})
        </Button>

        {admin?.role === "admin" ? (
          <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-full">
            <FiTrash2 className="h-4 w-4" /> Delete Application
          </Button>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this application?"
        description="This permanently deletes the application record and its stored résumé file. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Drawer>
  );
}
