import { useEffect } from "react";

// Locks background scroll while `locked` is true (e.g. mobile nav drawer open).
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
