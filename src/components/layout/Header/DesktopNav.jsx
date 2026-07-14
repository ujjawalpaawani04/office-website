import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { navLinks, servicesMenu } from "../../../data/navigation";
import { Container } from "../../common/Container";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { cn } from "../../../utils/cn";

const navLinkClasses = cn(
  "relative inline-block px-3 py-2 text-sm font-semibold uppercase tracking-wide",
  "transition-colors hover:text-highlight",
  // "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0",
  // "after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
);

const getNavLinkClassName = ({ isActive }) =>
  cn(navLinkClasses, isActive ? "text-highlight" : "text-white");

const menuLinkClasses =
  "block rounded px-2 py-1.5 text-sm text-black transition-colors hover:bg-[#155b5c] hover:text-white focus-visible:bg-brand-50 focus-visible:text-brand-700 focus-visible:outline-none";

export const DesktopNav = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  useClickOutside(servicesRef, () => setIsServicesOpen(false), isServicesOpen);
  const closeServices = () => setIsServicesOpen(false);

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

        <li ref={servicesRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isServicesOpen}
            aria-controls="services-menu"
            onClick={() => setIsServicesOpen((open) => !open)}
            className="flex items-center gap-0.5 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:text-highlight cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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
            className={cn("absolute inset-x-0 top-full", isServicesOpen ? "block" : "hidden")}
          >
            <div className="border-t border-brand-100 bg-[#f5f5f5] shadow-xl">
              <Container className="max-h-[calc(100vh-6rem)] overflow-y-auto py-8">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3 xl:grid-cols-6">
                  {servicesMenu.map((column) => (
                    <div key={column.title}>
                      <h3 className="mb-3 border-b-2 border-accent pb-2 text-sm font-bold text-brand-900">
                        {column.title}
                      </h3>

                      {column.items && (
                        <ul className="space-y-0.5">
                          {column.items.map((item) => (
                            <li key={item}>
                              <Link to="/" onClick={closeServices} className={menuLinkClasses}>
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}

                      {column.groups && (
                        <div className="space-y-4">
                          {column.groups.map((group) => (
                            <div key={group.title}>
                              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                                {group.title}
                              </h4>
                              <ul className="space-y-0.5">
                                {group.items.map((item) => (
                                  <li key={item}>
                                    <Link to="/" onClick={closeServices} className={menuLinkClasses}>
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Container>
            </div>
          </div>
        </li>

        {rest.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className={cn(navLinkClasses, "text-white")}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
