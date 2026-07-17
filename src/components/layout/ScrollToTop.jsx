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
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
