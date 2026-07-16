import { useEffect, useRef, useState } from "react";

// Tracks which of the given section ids is currently most prominent near the
// top of the viewport, for sidebar/anchor-nav active-state highlighting.
// `rootMargin` shrinks the effective viewport so a section activates once it
// reaches the upper portion of the screen, rather than the moment it appears.
//
// Elements are allowed to nest (e.g. one id on a small card inside a larger
// wrapping section that also has its own id) -the "active" element is the
// one whose top has most recently crossed the activation line, so a nested
// element correctly takes priority over its oversized ancestor once you've
// scrolled far enough into it. A single threshold (0) would only fire when
// an element crosses from non-intersecting to intersecting, leaving its
// cached boundingClientRect stale as scrolling continues; many thresholds
// make the browser re-fire (with a fresh rect) every ~5% ratio change.
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export function useScrollSpy(ids, { rootMargin = "-140px 0px -60% 0px" } = {}) {
  const [activeId, setActiveId] = useState(ids[0]);
  const stateRef = useRef(new Map());

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stateRef.current.set(entry.target.id, {
            isIntersecting: entry.isIntersecting,
            top: entry.boundingClientRect.top,
          });
        });

        const visible = ids
          .map((id) => stateRef.current.get(id) && { id, ...stateRef.current.get(id) })
          .filter((entry) => entry?.isIntersecting);

        if (visible.length === 0) return;

        // The active section is the one whose top is closest to (but not
        // below) the activation line -i.e. the largest `top` value, which
        // favors a small nested element over a much taller ancestor whose
        // top scrolled past long ago.
        const current = visible.reduce((best, entry) => (entry.top > best.top ? entry : best));
        setActiveId(current.id);
      },
      { rootMargin, threshold: THRESHOLDS }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}
