import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "./Button";

// Document 6 Confirmation/Delete Dialog - every destructive action across
// every module routes through this one component.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  loading,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 p-4">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl outline-none"
      >
        <div className="flex items-start gap-3">
          {danger ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FiAlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : null}
          <div>
            <h2 id="confirm-dialog-title" className="font-display font-semibold text-secondary">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-secondary/60">{description}</p> : null}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
