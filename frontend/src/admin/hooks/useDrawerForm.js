import { useCallback, useState } from "react";

// Wraps the "which row is being edited in the slide-over form Drawer" state
// shared by every admin list page that edits records inline (as opposed to
// navigating to a full editor route, like Services/BlogPosts). Every such
// page's Form component already takes the identical {open, initial, onClose,
// onSaved} contract, so `formProps` spreads directly onto it.
export function useDrawerForm(refetch) {
  const [formState, setFormState] = useState(null);

  const openCreate = useCallback(() => setFormState("create"), []);
  const openEdit = useCallback((row) => setFormState(row), []);
  const close = useCallback(() => setFormState(null), []);
  const onSaved = useCallback(() => {
    setFormState(null);
    refetch();
  }, [refetch]);

  return {
    formState,
    openCreate,
    openEdit,
    // `key` is deliberately kept out of formProps - React requires it be
    // passed directly (<Form key={formKey} {...formProps} />), never via
    // spread, or it only warns and silently drops the remount-on-different-
    // record behavior this key exists for.
    formKey: formState === "create" ? "create" : formState?.id ?? "closed",
    formProps: {
      open: Boolean(formState),
      initial: formState === "create" ? null : formState,
      onClose: close,
      onSaved,
    },
  };
}
