import { motion } from "framer-motion";
import { categories } from "../../../data/blogPosts";
import { cn } from "../../../utils/cn";

export const CategoryFilter = ({ activeCategory, onChange }) => {
  return (
    <div
      role="tablist"
      aria-label="Filter articles by category"
      className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {categories.map((category) => {
        const isActive = category.slug === activeCategory;
        return (
          <button
            key={category.slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.slug)}
            className={cn(
              "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
              isActive ? "text-white" : "border border-secondary/15 text-secondary/70 hover:border-brand-700/40 hover:text-brand-700"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-filter-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-brand-700"
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};
