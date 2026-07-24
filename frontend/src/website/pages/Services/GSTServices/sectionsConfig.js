import {
  FiHome,
  FiFilePlus,
  FiTarget,
  FiCalendar,
  FiPercent,
  FiCompass,
  FiAward,
  FiActivity,
} from "react-icons/fi";

// Single source of truth for the sidebar's scroll-spy navigation -each
// entry's `id` must match an element id somewhere on the page (either a
// top-level <section> or, for "gst-advisory", a specific card within the
// GST Solutions grid). Order matches the page's visual top-to-bottom flow
// so the sidebar highlights sections in the same order users scroll them.
export const SECTIONS = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "gst-registration", label: "GST Registration", icon: FiFilePlus },
  { id: "gst-advisory", label: "GST Advisory", icon: FiTarget },
  { id: "gst-return-filing", label: "GST Return Filing", icon: FiCalendar },
  { id: "itc", label: "Input Tax Credit (ITC)", icon: FiPercent },
  { id: "industries", label: "Industries We Serve", icon: FiCompass },
  { id: "why-choose-us", label: "Why Choose Us", icon: FiAward },
  { id: "gst-compliance", label: "GST Compliance", icon: FiActivity },
];

export const SECTION_IDS = SECTIONS.map((section) => section.id);
