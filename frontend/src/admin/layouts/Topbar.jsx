import { useRef, useState } from "react";
import { FiChevronDown, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useClickOutside } from "../../shared/hooks/useClickOutside";
import { useAuth } from "../auth/useAuth";

export function Topbar({ onOpenSidebar, breadcrumb }) {
  const { admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const initials = (admin?.name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-secondary/10 bg-white px-4 lg:px-6">
      {/* Inner row shares AdminLayout's max-w-[1600px] cap so the breadcrumb
          and profile menu stay aligned with the page content below instead
          of spreading to the far edges of the bar on ultra-wide/zoomed-out
          screens - the bar itself (bg-white border-b) still spans full width. */}
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="rounded-lg p-2 text-secondary/70 hover:bg-secondary/5 lg:hidden"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          {breadcrumb}
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary/5"
          >
            {admin?.photoUrl ? (
              <img
                src={admin.photoUrl}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {initials}
              </span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block font-medium text-secondary">{admin?.name}</span>
              <span className="block text-xs capitalize text-secondary/50">{admin?.role}</span>
            </span>
            <FiChevronDown className="h-4 w-4 text-secondary/40" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-secondary/10 bg-white py-1.5 shadow-lg"
            >
              <Link
                to="/admin/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-secondary/80 hover:bg-secondary/5"
              >
                <FiUser className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-secondary/80 hover:bg-secondary/5"
              >
                <FiLogOut className="h-4 w-4" aria-hidden="true" />
                Log Out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
