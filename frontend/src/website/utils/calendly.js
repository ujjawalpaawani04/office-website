// Calendly script/CSS loading, brand theming, and the postMessage listener -
// split out of components/common/CalendlyEmbed.jsx (which now only exports
// the <CalendlyEmbed> component) because mixing component and non-component
// exports in one file breaks React Fast Refresh (react-refresh/only-export-components).
import { useEffect } from "react";

// Deliberately NOT website/hooks/useLockBodyScroll.js: Calendly's own
// widget.js already runs a full lock/restore cycle on `document.body`
// (position, top, left, overflow, plus window.scrollTo to preserve scroll
// position - see openCalendlyPopup below) whenever its popup opens/closes.
// A second lock also toggling `body.style.overflow` races Calendly's
// save/restore and can leave the page stuck locked after the popup closes
// (whichever one's cleanup runs second overwrites the other's saved
// "previous" value). Locking `<html>` instead touches an element Calendly
// never does, so the two can never step on each other.
export function useLockHtmlScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousOverflow;
    };
  }, [locked]);
}

const WIDGET_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const WIDGET_CSS_SRC = "https://assets.calendly.com/assets/external/widget.css";

// Brand palette (see src/styles/index.css) mirrored here as hex-no-hash
// values for Calendly's embed theming query params, so the widget itself -
// not just the card around it - reads as part of the site instead of a
// generic, disconnected third-party blue-and-white iframe.
const DEFAULT_THEME = {
  backgroundColor: "ffffff",
  textColor: "011818", // --color-secondary
  primaryColor: "155b5c", // --color-brand-700
};

export function buildThemedUrl(url, theme) {
  if (!url) return url;
  const merged = { ...DEFAULT_THEME, ...theme };
  const [base, existingQuery] = url.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set("background_color", merged.backgroundColor);
  params.set("text_color", merged.textColor);
  params.set("primary_color", merged.primaryColor);
  // Calendly's own cookie/GDPR banner competes with our card's rounded
  // corners and looks out of place inside a themed embed - the site's own
  // pages already have their own cookie/privacy notice.
  params.set("hide_gdpr_banner", "1");
  return `${base}?${params.toString()}`;
}

// Module-level singleton so navigating to/from this page (or rendering the
// embed twice) never injects the <script> more than once - every caller
// awaits the same load promise.
let widgetScriptPromise = null;

export function loadCalendlyScript() {
  if (window.Calendly) return Promise.resolve(window.Calendly);
  if (widgetScriptPromise) return widgetScriptPromise;

  widgetScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Calendly);
    script.onerror = () => {
      widgetScriptPromise = null; // allow a retry to re-attempt the load
      reject(new Error("Failed to load the Calendly widget script."));
    };
    document.body.appendChild(script);
  });
  return widgetScriptPromise;
}

// Calendly's popup mode (unlike the inline embed) needs its own stylesheet
// for the overlay/modal chrome - injected once, same singleton pattern as
// the script above.
function loadCalendlyStylesheet() {
  if (document.querySelector(`link[href="${WIDGET_CSS_SRC}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = WIDGET_CSS_SRC;
  document.head.appendChild(link);
}

// Calendly doesn't post a documented "popup closed" message (only
// `calendly.event_scheduled` and a couple of view-tracking events), so open
// state can't just come from a postMessage flag. Its overlay is a real DOM
// node (`.calendly-overlay`) appended to <body> while open and removed on
// close (X button, Escape, backdrop click, or a completed booking) - a
// MutationObserver watching for that node's presence tracks the overlay's
// actual lifecycle rather than guessing, and reports it via `onChange` so
// the caller can drive its own scroll-lock state (see
// Appointment/components/BookingSection.jsx's useLockBodyScroll usage).
function watchPopupOverlay(onChange) {
  // `watchPopupOverlay` runs *before* `Calendly.initPopupWidget()` (see
  // below), so the very first check always finds no overlay yet. Only
  // disconnect after we've actually seen it open and then close again -
  // disconnecting on that first "not open yet" check (a bug an earlier
  // version of this had) tears the observer down before Calendly ever gets
  // a chance to append the overlay, so the popup opens and this never
  // fires again - the exact bug that let the background keep scrolling.
  let everOpened = false;

  const observer = new MutationObserver(sync);

  function sync() {
    const isOpen = Boolean(document.querySelector(".calendly-overlay"));
    onChange?.(isOpen);
    if (isOpen) {
      everOpened = true;
    } else if (everOpened) {
      observer.disconnect();
    }
  }

  observer.observe(document.body, { childList: true });
  sync(); // covers the (unlikely) case where the overlay is already present
}

/**
 * Opens Calendly's popup scheduling overlay - used instead of the inline
 * embed when a page wants booking to happen in a modal rather than taking
 * over a section of the page (see Appointment/components/BookingSection.jsx's
 * "Continue to Calendar" button). Listen for the booking result with
 * `useCalendlyEventListener` below, same as the inline embed's `onScheduled`.
 *
 * `onOverlayChange(isOpen)` fires whenever the popup's own overlay element
 * appears/disappears - pass it a state setter and feed that state into
 * `useLockBodyScroll` (website/hooks/useLockBodyScroll.js) to keep the page
 * behind the popup from scrolling while it's open.
 */
export async function openCalendlyPopup(url, { prefill, utm, theme, onOverlayChange } = {}) {
  const themedUrl = buildThemedUrl(url, theme);
  if (!themedUrl) throw new Error("No Calendly URL configured.");

  const Calendly = await loadCalendlyScript();
  loadCalendlyStylesheet();
  watchPopupOverlay(onOverlayChange);
  Calendly.initPopupWidget({ url: themedUrl, prefill: prefill || {}, utm: utm || {} });
}

/**
 * Standalone version of the `calendly.event_scheduled` listener CalendlyEmbed
 * uses internally - for callers (like the popup flow) that aren't rendering
 * the inline <CalendlyEmbed> component at all.
 */
export function useCalendlyEventListener(onScheduled) {
  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== "https://calendly.com") return;
      const payload = event.data;
      if (!payload || typeof payload.event !== "string" || !payload.event.startsWith("calendly.")) return;

      if (payload.event === "calendly.event_scheduled") {
        onScheduled?.({
          eventUri: payload.payload?.event?.uri,
          inviteeUri: payload.payload?.invitee?.uri,
          raw: payload.payload,
        });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onScheduled]);
}
