/**
 * Inner "content" slot (Inner 1 / Inner 3 in the row layout) - a compact
 * editorial card pairing with its own video thumbnail (see VideoThumbnail).
 */
export const ArticleContent = ({ article }) => {
  return (
    <article className="flex h-full flex-col rounded-l-2xl border border-brand-700/10 bg-white p-6 shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:border-brand-700/20 hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]">
      <p className="flex-1 text-sm leading-relaxed text-black font-style: italic">{article.description}</p>

      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-secondary sm:text-xl">
        {article.title}
      </h3>

      {article.designation ? (
        <p className="mt-1 text-sm text-secondary/70 font-semibold">{article.designation}</p>
      ) : null}

      {article.batch ? (
        <p className="mt-1 text-sm text-secondary/70">{article.batch}</p>
      ) : null}
    </article>
  );
};
