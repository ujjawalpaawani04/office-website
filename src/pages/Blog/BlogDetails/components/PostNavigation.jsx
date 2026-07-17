import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const cardClass =
  "group flex items-center gap-3 rounded-xl border border-secondary/10 bg-white p-4 transition-all duration-300 hover:border-brand-700/30 hover:shadow-md";

export const PostNavigation = ({ prev, next }) => {
  if (!prev && !next) return null;

  return (
    <div className="mt-10 grid gap-4 border-t border-secondary/10 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link to={`/blog/${prev.slug}`} className={cardClass}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700/10 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide text-black/40">
              Previous
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-black transition-colors duration-300 group-hover:text-brand-700">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link to={`/blog/${next.slug}`} className={`${cardClass} sm:flex-row-reverse sm:text-right`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700/10 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide text-black/40">
              Next
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-black transition-colors duration-300 group-hover:text-brand-700">
              {next.title}
            </span>
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};
