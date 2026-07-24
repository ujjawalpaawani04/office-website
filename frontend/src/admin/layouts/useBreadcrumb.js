import { useContext, useEffect } from "react";
import { BreadcrumbContext } from "./breadcrumbContext";

// items: [{ label, to? }]. Pages call this once near the top of render.
// Depends on the *serialized* value rather than the array reference, since
// most callers pass a fresh inline array literal every render - comparing
// by content instead of identity avoids re-running (and re-rendering the
// layout) on every single render of the page.
export function useBreadcrumb(items) {
  const { setItems } = useContext(BreadcrumbContext);
  const serialized = JSON.stringify(items);

  useEffect(() => {
    setItems(items);
    return () => setItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
}
