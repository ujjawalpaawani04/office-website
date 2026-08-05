import { useState } from "react";
import { Outlet } from "react-router-dom";

import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { BreadcrumbContext } from "./breadcrumbContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

// The shell every authenticated /admin/* page renders inside (mounted by
// ProtectedRoute in AdminRoutes.jsx). Owns the mobile sidebar-open state
// and the current breadcrumb, both of which individual pages influence
// via useBreadcrumb() / the Sidebar's own route-driven active state.
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  return (
    <BreadcrumbContext.Provider value={{ setItems: setBreadcrumbItems }}>
      {/* mx-auto + max-w here caps the *whole* shell (sidebar + content) as
          one unit on ultra-wide monitors (or a zoomed-out browser, which has
          the same effect - more CSS pixels of width to fill). Capping only
          the content below would leave the sidebar pinned to the true left
          edge of the browser while the content centers in the leftover
          space - visually off-balance. Centering the outer row instead keeps
          the sidebar flush against the content on both sides. Below `lg`
          this has no effect (viewport is far under 1920px), so it doesn't
          touch the mobile off-canvas sidebar's own `fixed` positioning. */}
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px] bg-secondary/[0.02]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* min-w-0 overrides the flex item's implicit min-width:auto (which
            is otherwise its content's min-content size) - without it, a wide
            child (the table) can force this column past its rightful share
            of the row instead of shrinking to it and letting the table's own
            overflow-x-auto take over. */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-0">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} breadcrumb={<AdminBreadcrumb items={breadcrumbItems} />} />
          <main className="flex-1 p-4 lg:p-6">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
}
