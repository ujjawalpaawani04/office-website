import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

/**
 * Inner "content" slot (Inner 1 / Inner 3 in the row layout) - a compact
 * editorial card, not a full article body. Full content lives on the
 * /insights/:slug detail page.
 */
export const ArticleContent = ({ article, index }) => {
  return (
    <article className="flex h-full flex-col rounded-l-2xl border border-brand-700/10 bg-white p-6 shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:border-brand-700/20 hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-700/60">
        Article {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="mt-2 font-display text-lg font-bold leading-snug text-secondary sm:text-xl">
        {article.title}
      </h3>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-secondary/70">{article.description}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-highlight/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary">
          {article.batch}
        </span>

        <Link
          to={`/insights/${article.slug}`}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors duration-300 hover:text-brand-600"
        >
          Read Article
          <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};
