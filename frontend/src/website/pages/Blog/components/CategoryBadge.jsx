import { cn } from "../../../../shared/utils/cn";

export const CategoryBadge = ({ category, className }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-highlight px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary shadow-md",
      className
    )}
  >
    {category}
  </span>
);
