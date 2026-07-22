import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

// Route guard for everything under /admin except /admin/login. Blocks
// rendering entirely while the initial silent-refresh check is in flight,
// so a protected page never flashes its content before we actually know
// whether the visitor is authenticated.
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
          role="status"
          aria-label="Checking session"
        />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
