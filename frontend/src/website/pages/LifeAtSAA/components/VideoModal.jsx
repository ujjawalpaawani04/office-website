import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMaximize, FiMinus, FiPlus, FiRotateCcw, FiX } from "react-icons/fi";
import { cn } from "../../../../shared/utils/cn";

const EASE = [0.22, 1, 0.36, 1];
const ZOOM_MIN = 0.8;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.2;
const ZOOM_DEFAULT = 1;

/**
 * Single shared modal instance (mounted once by InsightsArticles) rather
 * than one per card - the <video> element only exists while `article` is
 * set, so at most one video is ever loaded/playing at a time regardless of
 * how many cards are on the page.
 */
export const VideoModal = ({ article, onClose }) => {
  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);

  const isOpen = Boolean(article);

  // Body scroll lock while open, restored on close/unmount.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Focus management: move focus into the modal on open, restore it on close.
  useEffect(() => {
    if (!isOpen) return undefined;
    previouslyFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  // ESC to close, Tab trapped within the dialog.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset zoom every time a (new) video is opened.
  useEffect(() => {
    if (isOpen) setZoom(ZOOM_DEFAULT);
  }, [isOpen, article?.id]);

  const handleClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setZoom(ZOOM_DEFAULT);
    onClose();
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) handleClose();
  };

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10));
  const resetZoom = () => setZoom(ZOOM_DEFAULT);

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (container?.requestFullscreen) container.requestFullscreen();
    else if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="presentation"
          onMouseDown={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={article ? `${article.title} - video` : "Video"}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-black shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black">
              {article && (
                <video
                  ref={videoRef}
                  key={article.id}
                  src={article.video}
                  controls
                  playsInline
                  autoPlay
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                  className="h-full w-full object-contain transition-transform duration-300 ease-out"
                >
                  <track kind="captions" />
                </video>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary px-4 py-3 sm:px-6">
              <p className="min-w-0 truncate text-sm font-semibold text-white">{article?.title}</p>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  aria-label="Zoom out"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors",
                    zoom <= ZOOM_MIN ? "cursor-not-allowed opacity-30" : "hover:bg-white/10"
                  )}
                >
                  <FiMinus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-12 text-center text-xs font-semibold text-white/80" aria-live="polite">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  aria-label="Zoom in"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors",
                    zoom >= ZOOM_MAX ? "cursor-not-allowed opacity-30" : "hover:bg-white/10"
                  )}
                >
                  <FiPlus className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  aria-label="Reset zoom"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <FiRotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Fullscreen"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <FiMaximize className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
