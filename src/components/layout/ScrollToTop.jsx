import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation by default, which
// is most noticeable moving between two pages that share a route pattern
// (e.g. /insights/:slug -> a different slug) - the component re-renders in
// place rather than remounting, so the page stays scrolled wherever the
// link was clicked from.
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // The site sets a global `scroll-behavior: smooth` (for in-page anchor
    // links), which also hijacks plain scrollTo(0, 0) calls and animates
    // them - on a route change that shows up as the new page slowly
    // scrolling up from the old page's position. Force an instant jump so
    // every navigation actually starts at the top.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};
