import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiStar } from "react-icons/fi";
import { navLinks, servicesMenu, isServicesMenuItemActive } from "../../../data/navigation";
import { Container } from "../../common/Container";
import { cn } from "../../../utils/cn";

// Delay before closing on mouse-leave so crossing between the trigger and
// the panel (or a brief flick outside) doesn't flicker the menu shut.
const CLOSE_DELAY = 200;

const navLinkClasses = cn(
  "relative inline-block px-3 py-2 text-sm font-semibold uppercase tracking-wide",
  "transition-colors hover:text-highlight",
  // "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0",
  // "after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
);

const getNavLinkClassName = ({ isActive }) =>
  cn(navLinkClasses, isActive ? "text-highlight" : "text-white");

const menuLinkClasses =
  "group/item flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-black/80 transition-colors hover:bg-brand-700 hover:text-white focus-visible:bg-brand-700 focus-visible:text-white focus-visible:outline-none";
// Mirrors the `hover:`/`focus-visible:` treatment above so the active item
// (current route) looks identical to a hovered one without duplicating the
// color values in a third place.
const menuLinkActiveClasses = "bg-brand-700 text-white";

const featuredMenuLinkClasses =
  "group/item flex items-center justify-between gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3 py-2 text-sm font-medium text-black transition-colors hover:border-gold-500 hover:bg-gold-500/20 focus-visible:border-gold-500 focus-visible:bg-gold-500/20 focus-visible:outline-none";
const featuredMenuLinkActiveClasses = "border-gold-500 bg-gold-500/20";

export const DesktopNav = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const { pathname } = useLocation();
  const isServicesActive = pathname.startsWith("/services");

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openServices = () => {
    clearCloseTimeout();
    setIsServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, CLOSE_DELAY);
  };

  const closeServicesNow = () => {
    clearCloseTimeout();
    setIsServicesOpen(false);
  };

  useEffect(() => clearCloseTimeout, []);

  const handleContainerBlur = (event) => {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      closeServicesNow();
    }
  };

  const handleContainerKeyDown = (event) => {
    if (event.key === "Escape") {
      closeServicesNow();
      triggerRef.current?.focus();
    }
  };

  const [home, aboutUs, ...rest] = navLinks;

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center">
        <li>
          <NavLink to={home.to} end className={getNavLinkClassName}>
            {home.label}
          </NavLink>
        </li>
        <li>
          <NavLink to={aboutUs.to} className={getNavLinkClassName}>
            {aboutUs.label}
          </NavLink>
        </li>

        <li
          ref={containerRef}
          onMouseEnter={openServices}
          onMouseLeave={scheduleCloseServices}
          onFocus={openServices}
          onBlur={handleContainerBlur}
          onKeyDown={handleContainerKeyDown}
        >
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="true"
            aria-expanded={isServicesOpen}
            aria-controls="services-menu"
            aria-current={isServicesActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-0.5 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-highlight cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
              isServicesActive ? "text-highlight" : "text-white"
            )}
          >
            Services
            <RiArrowDropDownLine
              aria-hidden="true"
              className={cn("h-5 w-5 transition-transform duration-200", isServicesOpen && "rotate-180")}
            />
          </button>

          <div
            id="services-menu"
            role="region"
            aria-label="Services"
            aria-hidden={!isServicesOpen}
            className={cn(
              "absolute inset-x-0 top-full transition-[opacity,transform] duration-[250ms] ease-out",
              isServicesOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            )}
          >
            <div className="border-t border-brand-100 bg-[#f5f5f5] shadow-xl">
              <Container className="py-8">
                <div className="mx-auto grid max-w-4xl gap-x-12 gap-y-8 sm:grid-cols-2">
                  {servicesMenu.map((column) => (
                    <div key={column.title}>
                      <h3 className="mb-3 border-b-2 border-accent pb-2 text-sm font-bold text-brand-900">
                        {column.title}
                      </h3>

                      <ul className="space-y-1">
                        {column.items.map((item) => {
                          const isItemActive = isServicesMenuItemActive(pathname, item.to);
                          return (
                            <li key={item.label}>
                              <Link
                                to={item.to}
                                onClick={closeServicesNow}
                                aria-current={isItemActive ? "page" : undefined}
                                className={cn(
                                  item.badge ? featuredMenuLinkClasses : menuLinkClasses,
                                  isItemActive &&
                                    (item.badge ? featuredMenuLinkActiveClasses : menuLinkActiveClasses)
                                )}
                              >
                                <span className="flex items-center gap-1.5">
                                  {item.badge && (
                                    <FiStar
                                      className="h-3.5 w-3.5 shrink-0 text-gold-600"
                                      aria-hidden="true"
                                    />
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
              </Container>
            </div>
          </div>
        </li>

        {rest.map((link) =>
          // Placeholder items still point at "/" (no dedicated route yet), so
          // active-matching would falsely highlight them on the homepage.
          // Only links with a real destination get active-state styling.
          link.to === "/" ? (
            <li key={link.label}>
              <Link to={link.to} className={cn(navLinkClasses, "text-white")}>
                {link.label}
              </Link>
            </li>
          ) : (
            <li key={link.label}>
              <NavLink to={link.to} className={getNavLinkClassName}>
                {link.label}
              </NavLink>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};
