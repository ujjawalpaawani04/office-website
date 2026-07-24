import { useEffect, useState } from "react";
import { getServices } from "../api/services";

// Primary navigation links shown in the header.
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Life@SAA", to: "/life-at-saa" },
  { label: "Career", to: "/career" },
  { label: "Blog", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

const CATEGORY_LABELS = {
  our_services: "Our Services",
  corporate_specialised: "Corporate & Specialised Services",
};
const CATEGORY_ORDER = ["our_services", "corporate_specialised"];

// Builds the same [{title, items:[{label,to,badge}]}] shape the mega-menu
// components already render, from live /api/services data grouped by
// category - so a service admin adds/edits/reorders/(de)activates shows up
// in the header with no frontend change or redeploy required.
export function useServicesMenu() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getServices()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setServices(data);
      })
      .catch(() => {
        // Leave the menu empty on failure rather than throwing - the header
        // must never crash the whole site if the API is briefly unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return CATEGORY_ORDER.map((category) => ({
    title: CATEGORY_LABELS[category],
    items: services
      .filter((s) => s.category === category)
      .map((s) => ({ label: s.name, to: `/services/${s.slug}`, badge: s.badgeLabel || undefined })),
  })).filter((column) => column.items.length > 0);
}

// Shared by the desktop and mobile Services menus so both apply the exact
// same rule for which item counts as "active". Placeholder items still
// pointing at "/" (no dedicated route yet) never match, same as elsewhere
// in the nav - otherwise they'd falsely light up on the homepage.
export const isServicesMenuItemActive = (pathname, to) => to !== "/" && pathname === to;
