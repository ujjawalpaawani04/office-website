import { useEffect } from "react";

// Shared "close this open panel on an outside click or Escape" behavior -
// used by DropdownMenu and DateRangeFilter, the two popover-style toolbar
// controls in the admin panel. `containerRef` should wrap both the trigger
// button and the panel, so clicking the trigger itself doesn't immediately
// re-close what it just opened.
export function useDismissablePopover(containerRef, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, containerRef, onClose]);
}
