import { useEffect } from "react";

// Locks background scroll while `locked` is true (e.g. mobile nav drawer open).
// Locks <html> as well as <body> and disables touch panning, since iOS Safari
// still rubber-band scrolls the page behind a fixed overlay with only
// `body { overflow: hidden }`.
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const htmlStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const previous = {
      htmlOverflow: htmlStyle.overflow,
      bodyOverflow: bodyStyle.overflow,
      bodyHeight: bodyStyle.height,
      bodyTouchAction: bodyStyle.touchAction,
    };

    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    bodyStyle.height = "100vh";
    bodyStyle.touchAction = "none";

    return () => {
      htmlStyle.overflow = previous.htmlOverflow;
      bodyStyle.overflow = previous.bodyOverflow;
      bodyStyle.height = previous.bodyHeight;
      bodyStyle.touchAction = previous.bodyTouchAction;
    };
  }, [locked]);
}
