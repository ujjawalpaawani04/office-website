import { FiFilm, FiPlay } from "react-icons/fi";

/**
 * Inner "video" slot (Inner 2 / Inner 4) - thumbnail + play button only.
 * The <video> element here never plays; it exists solely to render a real
 * poster frame (preload="metadata" pulls only the header, not the file) so
 * every card shares one cached network fetch for the same source URL.
 * Actual playback only ever happens inside the shared VideoModal.
 */
export const VideoThumbnail = ({ article, onPlay }) => {
  return (
    <button
      type="button"
      onClick={() => onPlay(article)}
      aria-label={`Play video: ${article.title}`}
      className="group relative h-full min-h-[220px] w-full overflow-hidden rounded-r-2xl border border-brand-700/10 bg-secondary shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:border-brand-700/20 hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
    >
      <video
        src={`${article.video}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 transition-opacity duration-300 group-hover:from-black/70" />

      <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
        <FiFilm className="h-3 w-3" aria-hidden="true" />
        Video
      </span>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-highlight group-hover:text-secondary">
          <FiPlay className="ml-0.5 h-6 w-6" aria-hidden="true" />
        </span>
      </span>

      <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left">
        <span className="line-clamp-2 font-display text-sm font-bold leading-snug text-white drop-shadow">
          {article.title}
        </span>
      </span>
    </button>
  );
};
