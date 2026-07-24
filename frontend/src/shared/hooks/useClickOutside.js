import { useEffect } from "react";

// Calls `handler` when a pointer event or Escape key occurs outside `ref`.
// Pass `enabled = false` to skip attaching listeners when not needed.
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handler(event);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, handler, enabled]);
}
