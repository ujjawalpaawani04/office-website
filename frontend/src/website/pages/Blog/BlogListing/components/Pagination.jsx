import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../../../../shared/utils/cn";

// Builds a compact page list with an ellipsis once there are more pages than
// fit comfortably, e.g. [1, 2, 3, "...", 8] instead of listing every page.
const getPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withEllipsis = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(page);
  });
  return withEllipsis;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPageList(currentPage, totalPages);

  const buttonBase =
    "inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

  return (
    <nav aria-label="Blog pagination" className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(buttonBase, "border border-secondary/15 text-black disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:border-brand-700/40 enabled:hover:text-brand-700")}
      >
        <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-black/40">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              buttonBase,
              page === currentPage
                ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                : "border border-secondary/15 text-black hover:border-brand-700/40 hover:text-brand-700"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={cn(buttonBase, "border border-secondary/15 text-black disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:border-brand-700/40 enabled:hover:text-brand-700")}
      >
        <FiChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
};
