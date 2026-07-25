import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { SECTIONS, SECTION_IDS } from "../sectionsConfig";
import { useScrollSpy } from "../../../../hooks/useScrollSpy";
import { cn } from "../../../../../shared/utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const NavList = ({ activeId, onNavigate, className }) => (
  <nav aria-label="Income Tax Services sections" className={className}>
    <ul className="space-y-1">
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === activeId;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-black hover:bg-brand-50/60 hover:text-brand-700"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 h-5 w-1 rounded-full bg-brand-700 transition-transform duration-200",
                  isActive ? "scale-y-100" : "scale-y-0"
                )}
              />
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  isActive ? "text-brand-700" : "text-black/40 group-hover:text-brand-700"
                )}
                aria-hidden="true"
              />
              {section.label}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

const ConsultationButton = ({ className }) => (
  <a
    href="#contact"
    className={cn(
      "group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
      className
    )}
  >
    For More Details
    <FiArrowRight
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
    />
  </a>
);

export const Sidebar = () => {
  const activeId = useScrollSpy(SECTION_IDS);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeSection = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];
  const ActiveIcon = activeSection.icon;

  return (
    <>
      {/* Desktop: sticky vertical card */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="hidden lg:sticky lg:top-[120px] lg:flex lg:max-h-[calc(100vh-140px)] lg:flex-col lg:rounded-2xl lg:border lg:border-secondary/10 lg:bg-white lg:p-5 lg:shadow-sm"
      >
        <h2 className="shrink-0 border-l-4 border-brand-700 pl-3 font-display text-lg font-bold text-black">
          Income Tax Services
        </h2>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <NavList activeId={activeId} />
        </div>

        <ConsultationButton className="mt-4 w-full shrink-0" />
      </motion.aside>

      {/* Tablet & mobile: collapsible horizontal card, sits above content */}
      <div className="rounded-2xl border border-secondary/10 bg-white p-4 shadow-sm lg:hidden">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls="income-tax-mobile-nav"
          onClick={() => setIsExpanded((open) => !open)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-black">
            <ActiveIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
            {activeSection.label}
          </span>
          <FiChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-brand-700 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id="income-tax-mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap gap-2 border-t border-secondary/10 pt-3">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = section.id === activeId;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setIsExpanded(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                        isActive
                          ? "border-brand-700 bg-brand-700 text-white"
                          : "border-secondary/15 text-black hover:border-brand-700/40 hover:text-brand-700"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {section.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConsultationButton className="mt-4 w-full" />
      </div>
    </>
  );
};
