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
      <div className="flex min-h-screen bg-secondary/[0.02]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} breadcrumb={<AdminBreadcrumb items={breadcrumbItems} />} />
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
}
