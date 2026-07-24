import { useEffect, useState } from "react";

// Returns true once the page has scrolled past `threshold` pixels.
// Used to toggle an elevated/condensed header style on scroll.
export function useScrollPosition(threshold = 8) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
