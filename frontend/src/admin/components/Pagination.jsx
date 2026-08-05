import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../shared/utils/cn";

// Page numbers with the current page ± 1, plus first/last, collapsing any
// gap into a single "..." - keeps the bar short even with dozens of pages
// instead of rendering every single page number.
function getPageNumbers(current, total) {
  const items = [];
  let prev;
  for (let i = 1; i <= total; i++) {
    if (i !== 1 && i !== total && (i < current - 1 || i > current + 1)) continue;
    if (prev !== undefined && i - prev > 1) items.push("...");
    items.push(i);
    prev = i;
  }
  return items;
}

// Document 6 Pagination - server-side, driven by the {total, page,
// pageSize} envelope every admin list endpoint returns. `pageSizeOptions` +
// `onPageSizeChange` are optional - only Appointments.jsx passes them today,
// every other list page renders exactly as before (no "Rows per page"
// control).
export function Pagination({ page, pageSize, total, onPageChange, pageSizeOptions, onPageSizeChange }) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary/10 px-4 py-3 text-sm text-secondary/60">
      <span>
        Showing {from}-{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-lg border border-secondary/15 p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers(page, totalPages).map((item, i) =>
          item === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-secondary/40">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "min-w-8 rounded-lg px-2 py-1.5 text-sm font-medium",
                item === page ? "bg-brand-700 text-white" : "text-secondary/70 hover:bg-secondary/5"
              )}
            >
              {item}
            </button>
          )
        )}
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

      {onPageSizeChange ? (
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-secondary/15 bg-white px-2 py-1.5 text-sm text-secondary focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
          >
            {(pageSizeOptions || [10, 20, 50, 100]).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
