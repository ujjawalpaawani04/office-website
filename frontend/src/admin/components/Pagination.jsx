import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Document 6 Pagination - server-side, driven by the {total, page,
// pageSize} envelope every admin list endpoint returns.
export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-secondary/10 px-4 py-3 text-sm text-secondary/60">
      <span>
        Showing {from}-{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-lg border border-secondary/15 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded-lg border border-secondary/15 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
