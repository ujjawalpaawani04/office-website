import { useEffect } from "react";
import { FiX } from "react-icons/fi";

// Document 6 Drawer - used for create/edit forms on the simpler content
// modules (Document 2 §7-10, §14-16) instead of a full page navigation.
export function Drawer({ open, title, onClose, children, widthClassName = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-secondary/40" />
      <div className={`relative flex h-full w-full ${widthClassName} flex-col bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-secondary/10 px-5 py-4">
          <h2 className="font-display font-semibold text-secondary">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-secondary/50 hover:bg-secondary/5">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
