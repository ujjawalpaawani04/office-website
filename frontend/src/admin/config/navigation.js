import {
  FiActivity,
  FiAward,
  FiBriefcase,
  FiDatabase,
  FiEdit3,
  FiFileText,
  FiFolder,
  FiGrid,
  FiImage,
  FiInbox,
  FiMail,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiTag,
  FiUsers,
} from "react-icons/fi";

// Single source of truth for the sidebar (Document 2 §0.1). Each item's
// `roles` gates visibility via RoleGuard - an "editor" never sees an
// admin-only entry rendered-but-disabled, it simply isn't in the DOM.
// Grown incrementally: an item is only added here once its route is
// actually built and mounted in AdminRoutes.jsx, so the sidebar never
// links to a page that doesn't exist yet.
export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/admin", icon: FiGrid, roles: ["admin", "editor"], end: true }],
  },
  {
    label: "Content",
    items: [
      { label: "Blog Posts", to: "/admin/blog/posts", icon: FiFileText, roles: ["admin", "editor"] },
      { label: "Team Members", to: "/admin/team", icon: FiUsers, roles: ["admin", "editor"] },
      { label: "Testimonials", to: "/admin/testimonials", icon: FiMessageSquare, roles: ["admin", "editor"] },
      { label: "Awards", to: "/admin/awards", icon: FiAward, roles: ["admin", "editor"] },
      { label: "Certifications", to: "/admin/certifications", icon: FiAward, roles: ["admin", "editor"] },
      { label: "Firm Stats", to: "/admin/firm-stats", icon: FiActivity, roles: ["admin", "editor"] },
      { label: "Blog Categories", to: "/admin/blog/categories", icon: FiFolder, roles: ["admin", "editor"] },
      { label: "Blog Tags", to: "/admin/blog/tags", icon: FiTag, roles: ["admin", "editor"] },
      { label: "Blog Authors", to: "/admin/blog/authors", icon: FiEdit3, roles: ["admin", "editor"] },
      { label: "Media Library", to: "/admin/media", icon: FiImage, roles: ["admin", "editor"] },
    ],
  },
  {
    label: "Recruitment",
    items: [
      { label: "Job Openings", to: "/admin/job-openings", icon: FiBriefcase, roles: ["admin", "editor"] },
      { label: "Applications", to: "/admin/job-applications", icon: FiInbox, roles: ["admin", "editor"] },
    ],
  },
  {
    label: "Leads",
    items: [
      { label: "Enquiries", to: "/admin/enquiries", icon: FiMail, roles: ["admin", "editor"] },
      { label: "Newsletter", to: "/admin/newsletter", icon: FiMessageSquare, roles: ["admin", "editor"] },
    ],
  },
  {
    label: "Site",
    items: [{ label: "Settings", to: "/admin/settings", icon: FiSettings, roles: ["admin"] }],
  },
  {
    label: "System",
    items: [
      { label: "Users", to: "/admin/users", icon: FiUsers, roles: ["admin"] },
      { label: "Audit Log", to: "/admin/audit-log", icon: FiActivity, roles: ["admin"] },
      { label: "Security", to: "/admin/security", icon: FiShield, roles: ["admin"] },
      { label: "Database Utilities", to: "/admin/db-utilities", icon: FiDatabase, roles: ["admin"] },
    ],
  },
];
