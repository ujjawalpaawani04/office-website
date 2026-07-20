import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import { FiStar } from "react-icons/fi";
import { navLinks, servicesMenu, isServicesMenuItemActive } from "../../../data/navigation";
import { socialLinks } from "../../../data/socialLinks";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { cn } from "../../../utils/cn";
import { WhatsAppButton } from "../WhatsAppButton";

const topLevelLinkClasses = "block py-3 text-base font-semibold hover:text-accent";
const menuLinkClasses =
  "flex items-center justify-between gap-2 rounded-md py-3 pl-3 pr-2 text-sm text-black hover:bg-brand-50 hover:text-brand-700";
// Mirrors the `hover:` treatment above so the active item (current route)
// looks identical to a hovered one without duplicating the color values.
const menuLinkActiveClasses = "bg-brand-50 text-brand-700";
const featuredMenuLinkClasses =
  "flex items-center justify-between gap-2 rounded-md border border-gold-500/40 bg-gold-500/10 py-3 pl-3 pr-2 text-sm font-medium text-black hover:border-gold-500 hover:bg-gold-500/20";
const featuredMenuLinkActiveClasses = "border-gold-500 bg-gold-500/20";

const getTopLevelLinkClassName = ({ isActive }) =>
  cn(topLevelLinkClasses, isActive ? "text-accent" : "text-brand-700");

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
  const isServicesActive = location.pathname.startsWith("/services");

  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2">
        {/* Permanent part of the mobile header, beside the toggle, in both
            the open and closed states - the floating version (FloatingActions)
            is hidden on mobile entirely so there's never a duplicate. */}
        <WhatsAppButton className="h-9 w-9 shrink-0" iconClassName="h-5 w-5" />

        <button
          ref={toggleButtonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-panel"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {isOpen ? (
            <RiCloseLine className="h-7 w-7" aria-hidden="true" />
          ) : (
            <RiMenu3Line className="h-7 w-7" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 top-16 z-40 bg-secondary/40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Drawer */}
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-xl transition-all duration-200",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        )}
      >
        <nav aria-label="Mobile" className="divide-y divide-gray-100 px-5 py-2">
          <NavLink to={home.to} end className={getTopLevelLinkClassName} onClick={closeMenu}>
            {home.label}
          </NavLink>
          <NavLink to={aboutUs.to} className={getTopLevelLinkClassName} onClick={closeMenu}>
            {aboutUs.label}
          </NavLink>

          <div>
            <button
              type="button"
              aria-expanded={isServicesOpen}
              aria-controls="mobile-services-panel"
              aria-current={isServicesActive ? "page" : undefined}
              onClick={() => setIsServicesOpen((open) => !open)}
              className={cn(
                "flex w-full items-center justify-between py-3 text-base font-semibold",
                isServicesActive ? "text-accent" : "text-brand-700"
              )}
            >
              Services
              <RiArrowDownSLine
                aria-hidden="true"
                className={cn("h-5 w-5 transition-transform duration-200", isServicesOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence initial={false}>
              {isServicesOpen && (
                <motion.div
                  key="mobile-services-panel"
                  id="mobile-services-panel"
                  initial={{ height: 0, opacity: 0, y: -8 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-3">
                    {servicesMenu.map((column) => (
                      <div key={column.title} className="mb-4">
                        <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-accent">
                          {column.title}
                        </h3>

                        <ul className="space-y-1">
                          {column.items.map((item) => {
                            const isItemActive = isServicesMenuItemActive(location.pathname, item.to);
                            return (
                              <li key={item.label}>
                                <Link
                                  to={item.to}
                                  aria-current={isItemActive ? "page" : undefined}
                                  className={cn(
                                    item.badge ? featuredMenuLinkClasses : menuLinkClasses,
                                    isItemActive &&
                                      (item.badge ? featuredMenuLinkActiveClasses : menuLinkActiveClasses)
                                  )}
                                  onClick={closeMenu}
                                >
                                  <span className="flex items-center gap-1.5">
                                    {item.badge && (
                                      <FiStar className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
                                    )}
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {rest.map((link) =>
            // Placeholder items still point at "/" (no dedicated route yet), so
            // active-matching would falsely highlight them on the homepage.
            link.to === "/" ? (
              <Link
                key={link.label}
                to={link.to}
                className={cn(topLevelLinkClasses, "text-brand-700")}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className={getTopLevelLinkClassName}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            )
          )}

          {/* Social icons - shown here instead of the fixed side bar while
              the drawer is open (FloatingSocialBar hides itself in sync). */}
          <div className="py-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
              Connect With Us
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon, url, className }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-lg text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5",
                    className
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
