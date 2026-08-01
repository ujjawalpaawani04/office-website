import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { APPOINTMENT_SERVICES, MEETING_MODES } from "../appointmentServices";

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

// Calendly's "popup" is an in-page modal (a styled overlay + iframe it
// appends to the DOM) rather than a native window.open() popup, so it is
// not subject to popup-blocker restrictions and can be opened
// programmatically once the script has loaded, not only from a raw click.
let scriptPromise = null;
function loadCalendlyScript() {
  if (window.Calendly) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Calendly."));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

const buildGoogleCalendarUrl = (title, isoDate, isoTime) => {
  const start = new Date(`${isoDate}T${isoTime}:00`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const ConfirmationScreen = ({ appointmentId, selection }) => {
  const service = APPOINTMENT_SERVICES.find((s) => s.key === selection.service);
  const mode = MEETING_MODES.find((m) => m.key === selection.mode);
  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${selection.date}T00:00:00`)
  );

  return (
    <div className="text-center">
      <FiCheckCircle className="mx-auto h-14 w-14 text-brand-700" aria-hidden="true" />
      <h3 className="mt-4 font-display text-2xl font-bold text-black">Appointment Confirmed</h3>
      <p className="mt-2 text-sm text-black/70">
        Your appointment has been successfully scheduled. Calendly has sent a confirmation email with your meeting
        details{selection.mode === "video" ? ", including your meeting link" : ""}.
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-brand-700/10 bg-brand-50/40 p-6 text-left">
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-black/60">Appointment ID</dt>
            <dd className="font-semibold text-black">{appointmentId}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-black/60">Service</dt>
            <dd className="font-semibold text-black">{service?.label}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-black/60">Mode</dt>
            <dd className="font-semibold text-black">{mode?.label}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-black/60">Date</dt>
            <dd className="font-semibold text-black">{dateLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-black/60">Time</dt>
            <dd className="font-semibold text-black">{selection.time?.label}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-black/60">Status</dt>
            <dd className="rounded-full bg-brand-700/10 px-2.5 py-0.5 text-xs font-bold text-brand-700">Confirmed</dd>
          </div>
        </dl>
      </div>

      <p className="mx-auto mt-4 max-w-sm text-xs text-black/50">
        To cancel or reschedule, use the links in the confirmation email Calendly just sent you.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={buildGoogleCalendarUrl(`${service?.label} - Singh Amit & Associates`, selection.date, selection.time?.iso?.slice(11, 16))}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-brand-700/30 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700/5"
        >
          <FiCalendar className="h-4 w-4" aria-hidden="true" />
          Add to Calendar
        </a>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-600"
        >
          Back to Home
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-md border border-brand-700/30 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700/5"
        >
          Contact Office
        </Link>
      </div>
    </div>
  );
};

export const CalendlyHandoff = ({ appointmentId, schedulingUrl, selection }) => {
  const [scriptStatus, setScriptStatus] = useState("loading"); // loading | ready | error
  const [isScheduled, setIsScheduled] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadCalendlyScript()
      .then(() => {
        if (!cancelled) setScriptStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setScriptStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openPopup = () => {
    if (window.Calendly && schedulingUrl) {
      window.Calendly.initPopupWidget({ url: schedulingUrl });
    }
  };

  useEffect(() => {
    if (scriptStatus === "ready" && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptStatus]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.event === "calendly.event_scheduled") {
        setIsScheduled(true);
        window.Calendly?.closePopupWidget?.();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (isScheduled) {
    return <ConfirmationScreen appointmentId={appointmentId} selection={selection} />;
  }

  return (
    <div className="text-center">
      <h3 className="font-display text-xl font-bold text-black">One Last Step</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-black/70">
        Your request (ID <strong>{appointmentId}</strong>) has been received. Complete scheduling securely on the
        calendar that opens next - it's pre-filled with your details.
      </p>

      {scriptStatus === "error" ? (
        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-red-300 bg-red-50 p-6">
          <FiAlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
          <p className="text-sm text-red-700">
            We couldn't load the scheduling calendar. You can open it directly instead.
          </p>
          <a
            href={schedulingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-600"
          >
            Open Scheduling Page
            <FiExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPopup}
          disabled={scriptStatus !== "ready"}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {scriptStatus === "ready" ? "Complete Scheduling" : "Loading calendar…"}
        </button>
      )}
    </div>
  );
};
