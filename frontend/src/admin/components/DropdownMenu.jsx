import { useCallback, useId, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { cn } from "../../shared/utils/cn";
import { useDismissablePopover } from "../hooks/useDismissablePopover";

// Generic "kebab menu" used to move secondary/less-frequent actions off a
// page header, keeping only the single most-used action (e.g. "Sync
// Appointments") visible at all times - see Appointments.jsx for the first
// use. items: [{ label, icon, onClick, variant: "default" | "danger" }].
export function DropdownMenu({ items, align = "end", label = "More actions" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const menuId = useId();

  useDismissablePopover(containerRef, open, useCallback(() => setOpen(false), []));

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-secondary/15 text-secondary/70 transition-colors duration-150 hover:bg-secondary/5 hover:text-secondary",
          open && "bg-secondary/5 text-secondary"
        )}
      >
        <FiMoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute z-20 mt-2 w-56 origin-top-right rounded-xl border border-secondary/10 bg-white py-1.5 shadow-lg shadow-secondary/10 transition-all duration-150 ease-out",
          align === "end" ? "right-0" : "left-0",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              setOpen(false);
              item.onClick();
            }}
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-50",
              item.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-secondary/80 hover:bg-secondary/5"
            )}
          >
            {item.icon ? <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
