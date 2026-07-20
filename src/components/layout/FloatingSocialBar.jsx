import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socialLinks } from "../../data/socialLinks";
import { cn } from "../../utils/cn";

// How far the user needs to scroll on the home page before the bar reveals.
const SCROLL_REVEAL_THRESHOLD = 24;

export const FloatingSocialBar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // Everywhere except home, the bar is visible immediately. On home it
  // starts hidden and reveals itself the first time the user scrolls -
  // once revealed it stays that way for the rest of the visit, even if
  // they scroll back to the top.
  const [isRevealed, setIsRevealed] = useState(!isHome);

  useEffect(() => {
    setIsRevealed(!isHome);
  }, [isHome]);

  useEffect(() => {
    if (!isHome || isRevealed) return undefined;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_REVEAL_THRESHOLD) {
        setIsRevealed(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, isRevealed]);

  return (
    <div
      aria-label="Social media links"
      aria-hidden={!isRevealed}
      className={cn(
        "fixed right-0 top-[65%] z-40 flex -translate-y-1/2 flex-col gap-1.5 transition-all duration-500 ease-out sm:gap-2",
        isRevealed ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-8 opacity-0"
      )}
    >
      {socialLinks.map(({ label, icon: Icon, url, className }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          tabIndex={isRevealed ? undefined : -1}
          className={`flex h-11 w-11 items-center justify-center rounded-lg text-white shadow-md transition-all duration-300 ease-out hover:-translate-x-1 hover:brightness-110 focus-visible:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-10 lg:w-10 ${className}`}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};
