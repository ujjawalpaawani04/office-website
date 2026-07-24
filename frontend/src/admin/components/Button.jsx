import { FiLoader } from "react-icons/fi";
import { cn } from "../../shared/utils/cn";

const VARIANTS = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  secondary: "border border-secondary/15 text-secondary hover:bg-secondary/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-secondary/70 hover:bg-secondary/5",
};

export function Button({ variant = "primary", loading, disabled, className, children, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {loading ? <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
