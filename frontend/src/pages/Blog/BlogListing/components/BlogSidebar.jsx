import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch, FiHeadphones, FiCalendar, FiFilter, FiX } from "react-icons/fi";
import { CATEGORIES } from "../../../../data/blog/categories";
import { POPULAR_TAGS } from "../../../../data/blog/tags";
import { formatDate } from "../../../../utils/blog";
import { cn } from "../../../../utils/cn";
import { useLockBodyScroll } from "../../../../hooks/useLockBodyScroll";
import { useClickOutside } from "../../../../hooks/useClickOutside";

const EASE = [0.22, 1, 0.36, 1];

const NeedHelpCard = () => (
  <div className="mt-8 rounded-2xl border border-brand-700/10 bg-gradient-to-br from-brand-50 to-white p-6 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700/10">
      <FiHeadphones className="h-5 w-5 text-brand-700" aria-hidden="true" />
    </div>
    <h3 className="mt-4 font-display text-base font-bold text-black">Need Help?</h3>
    <p className="mt-1.5 text-sm leading-relaxed text-black/60">
      Our experts are ready to assist you with tax, compliance &amp; advisory.
    </p>
    <Link
      to="/contact"
      className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all duration-300 hover:bg-brand-700 hover:text-white"
    >
      Contact Our Team
    </Link>
  </div>
);

const SidebarBody = ({
  searchQuery,
  onSearchChange,
  categoryCounts,
  totalCount,
  activeCategory,
  onCategoryChange,
  onTagClick,
  recentPosts,
}) => (
  <>
    <div>
      <h2 className="font-display text-lg font-bold text-black">Search Articles</h2>
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <div className="relative mt-3">
        <input
          id="blog-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search here..."
          className="w-full rounded-lg border border-secondary/15 bg-white py-2.5 pl-4 pr-11 text-sm text-black placeholder:text-black/40 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
        />
        <span className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-brand-700 text-white">
          <FiSearch className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </div>

    <div className="mt-8">
      <h2 className="font-display text-lg font-bold text-black">Categories</h2>
      <ul className="mt-3 space-y-1">
        <li>
          <button
            type="button"
            onClick={() => onCategoryChange("All")}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200",
              activeCategory === "All"
                ? "bg-brand-50 font-semibold text-brand-700"
                : "text-black/75 hover:bg-brand-50/60 hover:text-brand-700"
            )}
          >
            All Categories
            <span className="text-xs text-black/40">({totalCount})</span>
          </button>
        </li>
        {CATEGORIES.map((category) => (
          <li key={category}>
            <button
              type="button"
              onClick={() => onCategoryChange(category)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200",
                activeCategory === category
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-black/75 hover:bg-brand-50/60 hover:text-brand-700"
              )}
            >
              {category}
              <span className="text-xs text-black/40">({String(categoryCounts[category] ?? 0).padStart(2, "0")})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>

    <div className="mt-8">
      <h2 className="font-display text-lg font-bold text-black">Popular Tags</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagClick(tag)}
            className="rounded-full border border-secondary/15 px-3 py-1.5 text-xs font-medium text-black/70 transition-colors duration-200 hover:border-brand-700/40 hover:bg-brand-50/60 hover:text-brand-700"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>

    <div className="mt-8">
      <h2 className="font-display text-lg font-bold text-black">Recent Articles</h2>
      <ul className="mt-3 space-y-4">
        {recentPosts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="group flex gap-3">
              <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={post.featuredImage}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </span>
              <span>
                <span className="line-clamp-2 text-sm font-semibold leading-snug text-black transition-colors duration-200 group-hover:text-brand-700">
                  {post.title}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-black/45">
                  <FiCalendar className="h-3 w-3" aria-hidden="true" />
                  {formatDate(post.publishDate)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <NeedHelpCard />
  </>
);

export const BlogSidebar = (props) => {
  const { activeCategory, searchQuery } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerButtonRef = useRef(null);
  const isFiltering = activeCategory !== "All" || searchQuery.trim() !== "";

  const closeFilter = () => setIsFilterOpen(false);

  useLockBodyScroll(isFilterOpen);
  useClickOutside(panelRef, closeFilter, isFilterOpen);

  useEffect(() => {
    if (!isFilterOpen) return undefined;
    panelRef.current?.focus();
  }, [isFilterOpen]);

  return (
    <>
      {/* Desktop: sticky vertical card. `lg:order-2` keeps it visually in the
          right column even though it now renders before <main> in the DOM
          (needed so the mobile filter trigger below can sit above the
          article list without affecting the desktop grid position). */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="hidden lg:sticky lg:top-[120px] lg:order-2 lg:flex lg:max-h-[calc(100vh-140px)] lg:flex-col lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-secondary/10 lg:bg-white lg:p-6 lg:shadow-sm"
      >
        <SidebarBody {...props} />
      </motion.aside>

      {/* Tablet & mobile: compact filter trigger + slide-in panel, replacing
          the old static stacked sidebar card. */}
      <div className="lg:hidden">
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setIsFilterOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isFilterOpen}
          aria-controls="blog-filter-panel"
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-secondary/10 bg-white px-5 py-3.5 text-sm font-semibold text-brand-700 shadow-sm transition-colors duration-200 hover:bg-brand-50/60 mb-4"
        >
          <span className="flex items-center gap-2">
            <FiFilter className="h-4 w-4" aria-hidden="true" />
            Search Articles
            {isFiltering && (
              <span className="h-1.5 w-1.5 rounded-full bg-highlight" aria-hidden="true" />
            )}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-black/40">
            {isFiltering ? "Active" : "Browse all"}
          </span>
        </button>

        {/* Backdrop */}
        <div
          onClick={closeFilter}
          aria-hidden="true"
          className={cn(
            "fixed inset-0 z-40 bg-secondary/40 transition-opacity duration-300",
            isFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        />

        {/* Slide-in panel */}
        <div
          id="blog-filter-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Filter and search articles"
          tabIndex={-1}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out",
            isFilterOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-secondary/10 px-6 py-4">
            <h2 className="font-display text-base font-bold text-black">Filter &amp; Search</h2>
            <button
              type="button"
              onClick={() => {
                closeFilter();
                triggerButtonRef.current?.focus();
              }}
              aria-label="Close filter panel"
              className="flex h-9 w-9 items-center justify-center rounded-md text-black/60 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <SidebarBody {...props} />
          </div>
        </div>
      </div>
    </>
  );
};
