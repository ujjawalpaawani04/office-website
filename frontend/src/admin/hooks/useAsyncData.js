import { useCallback, useEffect, useState } from "react";

// Shared "fetch on mount, track loading/error, expose a refetch" hook -
// every list/detail screen in the Admin Panel needs exactly this, so it's
// built once here instead of each module re-implementing the same effect.
//
// Caller memoizes its own fetcher with its own literal useCallback deps
// (e.g. `useCallback(() => fetchTeamMembers(page), [page])`); this hook
// just depends on that stable reference.
//
// State lives in one object (not separate data/error/loading booleans) so
// every setState call happens inside a .then()/.catch() callback - never
// synchronously in the effect body itself, including on refetch: bumping
// `reloadToken` re-runs the effect, but the visible "loading" state is set
// by refetch() itself, which is called from a click handler, never from
// inside an effect. An `ignore` flag guards against an older in-flight
// request (e.g. from before a filter changed) clobbering a newer result.
export function useAsyncData(fetcher) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetcher()
      .then((result) => {
        if (!ignore) setState({ status: "success", data: result, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ status: "error", data: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [fetcher, reloadToken]);

  const refetch = useCallback(() => {
    setState({ status: "loading", data: null, error: null });
    setReloadToken((n) => n + 1);
  }, []);

  return {
    data: state.data,
    error: state.error,
    loading: state.status === "loading",
    refetch,
  };
}
