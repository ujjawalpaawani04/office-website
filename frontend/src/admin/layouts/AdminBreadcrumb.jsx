import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

// Light-theme breadcrumb for the admin Topbar - distinct from the public
// site's dark-hero Breadcrumb (components/common/Breadcrumb.jsx), which is
// styled for a video/dark background and isn't a fit here.
export function AdminBreadcrumb({ items = [] }) {
  if (items.length === 0) return <span />;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 ? <FiChevronRight className="h-3.5 w-3.5 text-secondary/30" aria-hidden="true" /> : null}
            {item.to && !isLast ? (
              <Link to={item.to} className="text-secondary/60 hover:text-secondary">
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "font-semibold text-secondary" : "text-secondary/60"}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
