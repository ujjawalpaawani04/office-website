import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { Container } from "../../common/Container";
import { useScrollPosition } from "../../../hooks/useScrollPosition";
import { cn } from "../../../utils/cn";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

export const Header = () => {
  const isScrolled = useScrollPosition();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50  bg-white/95 backdrop-blur-sm transition-shadow duration-200",
        isScrolled ? "shadow-md shadow-secondary/5" : "shadow-none"
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4 overflow-hidden">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <img
            src={logo}
            alt="Singh Amit & Associates"
            className="w-50 object-contain h-25"
          />
          {/* <span className="flex flex-col leading-tight text-brand-700">
            <span className="text-base font-bold tracking-wide sm:text-lg lg:text-xl">
              SINGH AMIT
            </span>
            <span className="mt-0.5 border-t border-brand-700/40 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent sm:text-[11px]">
              &amp; Associates Firm
            </span>
          </span> */}
        </Link>

        <DesktopNav />
        <MobileNav />
      </Container>
    </header>
  );
};
