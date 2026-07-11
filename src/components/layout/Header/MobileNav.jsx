import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import { navLinks, servicesMenu } from "../../../data/navigation";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { cn } from "../../../utils/cn";

const topLevelLinkClasses = "block py-3 text-base font-semibold text-brand-700 hover:text-accent";
const menuLinkClasses = "block py-1.5 text-sm text-secondary/70 hover:text-accent";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const panelRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Close the drawer whenever the route changes (adjusting state during
  // render, per React's guidance, avoids an extra effect-driven re-render).
  const [lastPathname, setLastPathname] = useState(location.pathname);
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setIsOpen(false);
  }

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    panelRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const [home, aboutUs, ...rest] = navLinks;
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleButtonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 items-center justify-center rounded-md text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {isOpen ? (
          <RiCloseLine className="h-7 w-7" aria-hidden="true" />
        ) : (
          <RiMenu3Line className="h-7 w-7" aria-hidden="true" />
        )}
      </button>

      {/* Backdrop */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 top-20 z-40 bg-secondary/40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Drawer */}
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow-xl transition-all duration-200",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        )}
      >
        <nav aria-label="Mobile" className="divide-y divide-gray-100 px-5 py-2">
          <Link to={home.to} className={topLevelLinkClasses} onClick={closeMenu}>
            {home.label}
          </Link>
          <Link to={aboutUs.to} className={topLevelLinkClasses} onClick={closeMenu}>
            {aboutUs.label}
          </Link>

          <div>
            <button
              type="button"
              aria-expanded={isServicesOpen}
              aria-controls="mobile-services-panel"
              onClick={() => setIsServicesOpen((open) => !open)}
              className="flex w-full items-center justify-between py-3 text-base font-semibold text-brand-700"
            >
              Services
              <RiArrowDownSLine
                aria-hidden="true"
                className={cn("h-5 w-5 transition-transform duration-200", isServicesOpen && "rotate-180")}
              />
            </button>

            <div id="mobile-services-panel" className={cn("pb-3", isServicesOpen ? "block" : "hidden")}>
              {servicesMenu.map((column) => (
                <div key={column.title} className="mb-4">
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-accent">
                    {column.title}
                  </h3>

                  {column.items && (
                    <ul>
                      {column.items.map((item) => (
                        <li key={item}>
                          <Link to="/" className={cn(menuLinkClasses, "pl-3")} onClick={closeMenu}>
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {column.groups &&
                    column.groups.map((group) => (
                      <div key={group.title} className="mt-2">
                        <h4 className="mb-1 pl-3 text-xs font-semibold text-brand-700">{group.title}</h4>
                        <ul>
                          {group.items.map((item) => (
                            <li key={item}>
                              <Link to="/" className={cn(menuLinkClasses, "pl-6")} onClick={closeMenu}>
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {rest.map((link) => (
            <Link key={link.label} to={link.to} className={topLevelLinkClasses} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
