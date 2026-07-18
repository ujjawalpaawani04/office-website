import {
  FiHome,
  FiClipboard,
  FiActivity,
  FiAward,
  FiTrendingUp,
  FiCompass,
} from "react-icons/fi";

// Single source of truth for the sidebar's scroll-spy navigation -each
// entry's `id` must match a top-level <section> id somewhere on the page.
// Order matches the page's visual top-to-bottom flow so the sidebar
// highlights sections in the same order users scroll them.
export const SECTIONS = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "accounting-services", label: "Our Services", icon: FiClipboard },
  { id: "process", label: "Our Process", icon: FiActivity },
  { id: "why-choose-us", label: "Why Choose Us", icon: FiAward },
  { id: "benefits", label: "Benefits", icon: FiTrendingUp },
  { id: "industries", label: "Industries We Serve", icon: FiCompass },
];

export const SECTION_IDS = SECTIONS.map((section) => section.id);
