import { useEffect, useRef } from "react";
import { FiMail } from "react-icons/fi";
import { Button } from "./Button";

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-secondary/10 text-secondary/60",
};

// Step 3's Smart Newsletter Recommendation popup - shown after a blog post
// or service is published/updated when the backend's keyword classifier
// (newsletter_service.py::classify_content) flags it as worth telling
// subscribers about. Purely a suggestion: the admin always has the final
// say via Send Newsletter / Skip, and nothing is ever sent automatically.
export function NewsletterRecommendationModal({ open, suggestion, onSend, onSkip, sending }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onSkip();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onSkip]);

  if (!open || !suggestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 p-4">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="newsletter-suggestion-title"
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl outline-none"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700/10 text-brand-700">
            <FiMail className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[suggestion.priority] || PRIORITY_STYLES.low}`}>
              {suggestion.priority} priority
            </span>
            <h2 id="newsletter-suggestion-title" className="mt-2 font-display font-semibold text-secondary">
              This update looks important for your subscribers. Would you like to send a newsletter?
            </h2>
            {suggestion.reason ? <p className="mt-1 text-sm text-secondary/60">{suggestion.reason}</p> : null}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onSkip} disabled={sending}>
            Skip
          </Button>
          <Button variant="primary" onClick={onSend} loading={sending}>
            Send Newsletter
          </Button>
        </div>
      </div>
    </div>
  );
}
