import { useEffect, useState } from "react";

const STORAGE_KEY = "saa_disclaimer_ack";

/**
 * First-visit consent gate for the ICAI-mandated disclaimer (see the full
 * text at /disclaimer). Shows once per browser - controlled purely by a
 * localStorage flag - before the visitor is taken to have read the site's
 * content. Mounted once in App.jsx, next to <AppRoutes/> rather than inside
 * it, so it renders as a global overlay regardless of which page is landed
 * on first. Because it sits outside the router tree it uses a plain <a>,
 * not react-router's <Link>, for the "read the full disclaimer" link.
 */
// Read the flag lazily (once, as React's initial-state initializer) rather
// than in an effect, so the very first render already reflects it instead
// of flashing closed-then-open a tick later.
const hasAcknowledged = () => typeof window !== "undefined" && Boolean(window.localStorage.getItem(STORAGE_KEY));

export const DisclaimerGate = () => {
  const [visible, setVisible] = useState(() => !hasAcknowledged());
  const [stage, setStage] = useState("ask"); // "ask" | "disagreed"

  // Lock page scroll while the gate is up, same convention as VideoModal.
  useEffect(() => {
    if (!visible) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  const handleAgree = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const handleDisagree = () => setStage("disagreed");
  const handleReconsider = () => setStage("ask");

  // Design choice for "I Disagree": we never write the ack flag (so the
  // visitor is never silently treated as having agreed), and we never trap
  // them on a dead-end screen either - "Go Back" returns to the question in
  // case they clicked by mistake, and "Leave Site" is an explicit, separate
  // action that takes them to a blank page rather than breaking navigation.
  const handleLeave = () => {
    window.location.href = "about:blank";
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-secondary/70 p-4 backdrop-blur-sm"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="disclaimer-gate-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        {stage === "ask" ? (
          <>
            <h2 id="disclaimer-gate-title" className="font-display text-xl font-bold text-secondary sm:text-2xl">
              Disclaimer
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-secondary/70">
              <p>
                In accordance with the Website Guidelines of the Institute of Chartered Accountants of
                India, please note before proceeding:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  You are seeking information about Singh Amit &amp; Associates of your own accord; nothing
                  on this site is an advertisement, solicitation or invitation to engage the firm.
                </li>
                <li>
                  The content here is general information only, not professional advice, and browsing it
                  does not create a client relationship.
                </li>
                <li>You should obtain specific professional advice before acting on anything published here.</li>
              </ul>
              <p>
                Read the full{" "}
                <a
                  href="/disclaimer"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-700 underline hover:text-highlight"
                >
                  Disclaimer
                </a>{" "}
                for complete terms.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleDisagree}
                className="rounded-lg border border-secondary/20 px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/5"
              >
                I Disagree
              </button>
              <button
                type="button"
                onClick={handleAgree}
                className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
              >
                I Agree
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="disclaimer-gate-title" className="font-display text-xl font-bold text-secondary sm:text-2xl">
              You have chosen not to proceed
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-secondary/70">
              You need to agree to the Disclaimer to continue browsing this website. If you selected
              &ldquo;I Disagree&rdquo; by mistake, you can go back and review it again. Otherwise, you may
              leave the site now.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleLeave}
                className="rounded-lg border border-secondary/20 px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/5"
              >
                Leave Site
              </button>
              <button
                type="button"
                onClick={handleReconsider}
                className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
              >
                Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
