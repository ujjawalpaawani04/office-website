import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

// Calls `onIdle` once no user activity has been seen for `timeoutMs`. Only
// listens while `enabled` is true, so it's a no-op before login.
//
// `warningMs`/`onWarning` are optional: if both are given, `onWarning` fires
// once, `warningMs` before `onIdle` would - e.g. a "you're about to be
// signed out" toast ahead of the actual logout. Reset by the same activity
// events as the idle timer itself, so it never fires if the warning window
// only opens because the user briefly stepped away.
export function useIdleTimeout(timeoutMs, onIdle, enabled, { warningMs, onWarning } = {}) {
  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const onIdleRef = useRef(onIdle);
  const onWarningRef = useRef(onWarning);

  useEffect(() => {
    onIdleRef.current = onIdle;
    onWarningRef.current = onWarning;
  }, [onIdle, onWarning]);

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
      timerRef.current = window.setTimeout(() => onIdleRef.current(), timeoutMs);
      if (warningMs && onWarningRef.current) {
        warningTimerRef.current = window.setTimeout(() => onWarningRef.current(), Math.max(timeoutMs - warningMs, 0));
      }
    };

    resetTimer();
    ACTIVITY_EVENTS.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
      ACTIVITY_EVENTS.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [timeoutMs, enabled, warningMs]);
}
