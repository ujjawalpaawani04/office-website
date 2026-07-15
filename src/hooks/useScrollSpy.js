import { useEffect, useState } from "react";

// Tracks which of the given section ids is currently most prominent near the
// top of the viewport, for sidebar/anchor-nav active-state highlighting.
// `rootMargin` shrinks the effective viewport so a section activates once it
// reaches the upper portion of the screen, rather than the moment it appears.
export function useScrollSpy(ids, { rootMargin = "-140px 0px -60% 0px" } = {}) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const topMost = visible.reduce((closest, entry) =>
          entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}
