import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);
}

// Keeps keyboard focus cycling within `containerRef` while `active` is true
// (Tab from the last focusable element wraps to the first, Shift+Tab from
// the first wraps to the last) and moves focus onto the container's first
// focusable element as soon as it opens - the standard modal behavior
// (WAI-ARIA APG "Dialog Modal"). Without this, Tab could move focus behind
// an open ConfirmDialog/Drawer onto the page underneath.
export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    if (!container.contains(document.activeElement)) {
      getFocusable(container)[0]?.focus();
    }

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = getFocusable(container);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const goingBackward = e.shiftKey;
      const atEdge = goingBackward
        ? document.activeElement === first || !container.contains(document.activeElement)
        : document.activeElement === last || !container.contains(document.activeElement);

      if (atEdge) {
        e.preventDefault();
        (goingBackward ? last : first).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}
