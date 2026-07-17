import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { cn } from "../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

/**
 * Breadcrumb trail for dark hero sections.
 * `items`: [{ label, to? }] - trailing entries after Home. Omit `to` for a
 * plain (unlinked) crumb, e.g. a category label like "Services". The final
 * item is always styled as the current page regardless of whether it has `to`.
 */
export const Breadcrumb = ({ items, delay = 0.5, className = "" }) => {
  return (
    <motion.nav
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={delay}
      aria-label="Breadcrumb"
      className={cn(
        "mt-10 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/50",
        className
      )}
    >
      <Link to="/" className="transition-colors hover:text-highlight">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            <FiChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item.to && !isLast ? (
              <Link to={item.to} className="transition-colors hover:text-highlight">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white/80" : undefined} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </motion.nav>
  );
};
