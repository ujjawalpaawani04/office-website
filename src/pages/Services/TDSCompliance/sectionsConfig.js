import {
  FiHome,
  FiFilePlus,
  FiTarget,
  FiCalendar,
  FiFileText,
  FiCompass,
  FiAward,
  FiActivity,
  FiHelpCircle,
  FiMail,
} from "react-icons/fi";

// Single source of truth for the sidebar's scroll-spy navigation -each
// entry's `id` must match an element id somewhere on the page (either a
// top-level <section> or, for "tds-advisory", a specific card within the
// TDS Solutions grid). Order matches the page's visual top-to-bottom flow
// so the sidebar highlights sections in the same order users scroll them.
export const SECTIONS = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "tds-services", label: "TDS Compliance Services", icon: FiFilePlus },
  { id: "tds-advisory", label: "TDS Advisory", icon: FiTarget },
  { id: "tds-return-filing", label: "TDS Return Filing", icon: FiCalendar },
  { id: "forms-reconciliation", label: "Form 16 / 16A & Reconciliation", icon: FiFileText },
  { id: "who-needs-tds", label: "Who Needs TDS Compliance", icon: FiCompass },
  { id: "why-choose-us", label: "Why Choose Us", icon: FiAward },
  { id: "tds-compliance-check", label: "TDS Compliance Health Check", icon: FiActivity },
  { id: "faqs", label: "FAQs", icon: FiHelpCircle },
  { id: "contact", label: "Contact", icon: FiMail },
];

export const SECTION_IDS = SECTIONS.map((section) => section.id);
