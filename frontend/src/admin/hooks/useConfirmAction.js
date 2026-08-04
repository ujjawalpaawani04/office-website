import { useCallback, useState } from "react";

import { ApiError } from "../../shared/api/client";
import { useToast } from "../toast/useToast";

// Wraps the "click a row action -> ConfirmDialog opens -> confirm calls the
// API -> toast + refetch" sequence repeated across every admin list page
// (delete/deactivate/close/reset-password/unsubscribe/etc). One instance per
// distinct confirm action a page needs - most pages need one, some (Awards,
// Testimonials, Team Members, Job Openings) need two: a reversible action
// plus a hard delete.
//
// `showErrorToast: false` opts out of the toast on failure for the couple of
// pages (TaxonomyList, BlogPosts) that show the error inline in the
// ConfirmDialog's description instead - `error` is always returned either
// way so both styles are still possible.
export function useConfirmAction(action, { successMessage, errorMessage = "Something went wrong.", showErrorToast = true, onSuccess } = {}) {
  const { showToast } = useToast();
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback((row) => {
    setError(null);
    setPending(row);
  }, []);

  const cancel = useCallback(() => setPending(null), []);

  const confirm = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await action(pending);
      if (successMessage) showToast(typeof successMessage === "function" ? successMessage(pending) : successMessage);
      setPending(null);
      onSuccess?.(pending);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : errorMessage;
      setError(message);
      if (showErrorToast) showToast(message, "error");
    } finally {
      setBusy(false);
    }
  }, [action, pending, successMessage, errorMessage, showErrorToast, onSuccess, showToast]);

  return { pending, busy, error, request, confirm, cancel };
}
