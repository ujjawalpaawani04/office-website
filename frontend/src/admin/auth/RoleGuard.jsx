import { useAuth } from "./useAuth";

// Permission Wrapper (Document 6 / Document 2 §0.1): hides children instead
// of merely disabling them when the current admin's role isn't in `allow`,
// e.g. sidebar entries an "editor" should never even see, like Users or
// Audit Log. `fallback` lets a screen show an explanatory message instead
// of silently rendering nothing, where that's clearer for the user.
export function RoleGuard({ allow, children, fallback = null }) {
  const { admin } = useAuth();
  if (!admin || !allow.includes(admin.role)) {
    return fallback;
  }
  return children;
}
