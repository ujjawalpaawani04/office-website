import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch, FiHeadphones, FiCalendar } from "react-icons/fi";
import { CATEGORIES } from "../../../../data/blog/categories";
import { POPULAR_TAGS } from "../../../../data/blog/tags";
import { formatDate } from "../../../../utils/blog";
import { cn } from "../../../../utils/cn";

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
  return (
    <>
      {/* Desktop: sticky vertical card */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="hidden lg:sticky lg:top-[120px] lg:flex lg:max-h-[calc(100vh-140px)] lg:flex-col lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-secondary/10 lg:bg-white lg:p-6 lg:shadow-sm"
      >
        <SidebarBody {...props} />
      </motion.aside>

      {/* Tablet & mobile: static card above the article grid */}
      <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm lg:hidden">
        <SidebarBody {...props} />
      </div>
    </>
  );
};
