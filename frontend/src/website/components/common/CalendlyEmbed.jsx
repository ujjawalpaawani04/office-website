import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { buildThemedUrl, loadCalendlyScript } from "../../utils/calendly";

// A calendar-shaped loading skeleton (month header + weekday row + day
// grid + time-slot list) reads instantly as "a calendar is loading" rather
// than generic gray bars, and roughly matches Calendly's own month-view
// layout so the swap-in feels seamless.
function CalendarSkeleton() {
  return (
    <div className="absolute inset-0 flex animate-pulse flex-col gap-6 rounded-2xl border border-secondary/10 bg-white p-6 sm:flex-row sm:gap-8 sm:p-8">
      <div className="flex-1">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-5 w-32 rounded-md bg-secondary/10" />
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-full bg-secondary/10" />
            <div className="h-7 w-7 rounded-full bg-secondary/10" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`wd-${i}`} className="h-3 rounded bg-secondary/10" />
          ))}
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={`day-${i}`}
              className={`aspect-square rounded-full ${[2, 8, 15, 16, 22].includes(i) ? "bg-brand-700/15" : "bg-secondary/[0.06]"}`}
            />
          ))}
        </div>
      </div>
      <div className="w-full shrink-0 sm:w-40">
        <div className="mb-4 h-4 w-24 rounded-md bg-secondary/10" />
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg border border-secondary/10 bg-secondary/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Calendly inline embed. Nothing about the event type, prefill
 * data, or tracking params is hardcoded - all of it is passed in as props.
 * Themed to the site's brand colors via Calendly's embed customization
 * params (background_color/text_color/primary_color) rather than left as
 * Calendly's generic default styling. See utils/calendly.js for the popup
 * variant of this same integration (openCalendlyPopup / useCalendlyEventListener).
 *
 * Fires `onScheduled({ eventUri, inviteeUri })` the instant Calendly's
 * script posts a `calendly.event_scheduled` message - see
 * appointment_service.py for why this (not a webhook) is how bookings
 * reach the backend on Calendly's free plan.
 */
export function CalendlyEmbed({ url, prefill, utm, theme, onScheduled, minHeight = 780 }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  // Calendly's iframe doesn't size itself to its content by default - left
  // at a fixed height it clips the calendar into its own internal
  // scrollbar (cramped, unprofessional). Calendly posts the real content
  // height via `calendly.page_height`; once we hear it, the container
  // grows to match so the whole calendar + time slots are visible without
  // an inner scroll. Starts at `minHeight` as a reasonable first paint.
  const [contentHeight, setContentHeight] = useState(minHeight);
  const themedUrl = buildThemedUrl(url, theme);

  useEffect(() => {
    if (!themedUrl) return;

    let cancelled = false;
    setStatus("loading");

    loadCalendlyScript()
      .then((Calendly) => {
        if (cancelled || !containerRef.current || !Calendly) return;
        containerRef.current.innerHTML = "";
        Calendly.initInlineWidget({
          url: themedUrl,
          parentElement: containerRef.current,
          prefill: prefill || {},
          utm: utm || {},
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      // Defensive: React StrictMode double-invokes this effect on mount in
      // dev, so a run that gets cancelled before its widget finishes
      // initializing must not leave a stale iframe behind for the next run.
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
    // Re-initializes whenever the visitor's prefill details change (they
    // filled in the details form) or the target event type changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themedUrl, JSON.stringify(prefill), JSON.stringify(utm)]);

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== "https://calendly.com") return;
      const payload = event.data;
      if (!payload || typeof payload.event !== "string" || !payload.event.startsWith("calendly.")) return;

      if (payload.event === "calendly.page_height") {
        const height = Number(payload.payload?.height);
        if (height > 0) setContentHeight(Math.max(height, minHeight));
        return;
      }

      if (payload.event === "calendly.event_scheduled") {
        // Calendly's postMessage payload only guarantees event/invitee
        // URIs - no start time, event name, or meeting link. Pass the raw
        // payload through too (as `raw`) so a caller can opportunistically
        // read anything Calendly does include without this component
        // needing to hardcode assumptions about the exact shape.
        onScheduled?.({
          eventUri: payload.payload?.event?.uri,
          inviteeUri: payload.payload?.invitee?.uri,
          raw: payload.payload,
        });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onScheduled, minHeight]);

  const effectiveStatus = themedUrl ? status : "error";

  if (effectiveStatus === "error") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center"
        style={{ minHeight }}
      >
        <FiAlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        <p className="text-sm font-semibold text-red-700">We couldn't load the booking calendar.</p>
        <p className="max-w-sm text-sm text-red-600/80">
          This can happen on a slow or blocked connection. Please refresh the page, or reach out to us directly using
          the contact details below.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl transition-[height] duration-300" style={{ height: contentHeight }}>
      {status === "loading" && <CalendarSkeleton />}
      {/*
        Deliberately NOT class="calendly-inline-widget" - that's the class
        Calendly's own script auto-scans the DOM for (its "declarative"
        embed, driven by a data-url attribute) and initializes on its own.
        This component uses the imperative Calendly.initInlineWidget() API
        instead; giving the container that class too makes Calendly's
        auto-scanner ALSO try to init this element, find no data-url, and
        throw "Cannot read properties of null (reading 'split')" from
        inside widget.js. Only one of the two initialization paths may
        target a given element.

        height (not min-height): Calendly's iframe fills its parent's
        height and scrolls internally if the parent is shorter than the
        calendar content - see the contentHeight state above, kept in sync
        with Calendly's own `calendly.page_height` postMessage.
      */}
      <div ref={containerRef} className="calendly-embed-root h-full w-full" style={{ height: contentHeight }} />
    </div>
  );
}
