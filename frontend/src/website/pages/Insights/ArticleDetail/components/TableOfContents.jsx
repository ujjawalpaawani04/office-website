import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronDown, FiList } from "react-icons/fi";
import { useScrollSpy } from "../../../../hooks/useScrollSpy";
import { cn } from "../../../../../shared/utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const NavList = ({ sections, activeId, onNavigate }) => (
  <nav aria-label="Table of contents">
    <ul className="space-y-1">
      {sections.map((section, i) => {
        const isActive = section.id === activeId;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group relative flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-secondary/70 hover:bg-brand-50/60 hover:text-brand-700"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 h-5 w-1 rounded-full bg-brand-700 transition-transform duration-200",
                  isActive ? "scale-y-100" : "scale-y-0"
                )}
              />
              <span
                className={cn(
                  "shrink-0 tabular-nums",
                  isActive ? "text-brand-700" : "text-secondary/40 group-hover:text-brand-700"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

export const TableOfContents = ({ sections }) => {
  const ids = sections.map((section) => section.id);
  const activeId = useScrollSpy(ids);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeSection = sections.find((section) => section.id === activeId) ?? sections[0];

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
        <h2 className="flex shrink-0 items-center gap-2 border-l-4 border-brand-700 pl-3 font-display text-lg font-bold text-secondary">
          <FiList className="h-4 w-4 text-brand-700" aria-hidden="true" />
          Table of Contents
        </h2>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <NavList sections={sections} activeId={activeId} />
        </div>

        <Link
          to="/contact"
          className="group mt-4 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Talk to an Expert
          <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.aside>

      {/* Tablet & mobile: collapsible card */}
      <div className="rounded-2xl border border-secondary/10 bg-white p-4 shadow-sm lg:hidden">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls="article-toc-mobile"
          onClick={() => setIsExpanded((open) => !open)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <FiList className="h-4 w-4 text-brand-700" aria-hidden="true" />
            {activeSection?.heading ?? "Table of Contents"}
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
              id="article-toc-mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 border-t border-secondary/10 pt-3">
                <NavList sections={sections} activeId={activeId} onNavigate={() => setIsExpanded(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
