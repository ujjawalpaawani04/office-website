import {
  FiHome,
  FiFileText,
  FiTrendingUp,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2,
  FiRepeat,
} from "react-icons/fi";

// Single source of truth for the sidebar's scroll-spy navigation -each
// entry's `id` must match the corresponding section's `id` attribute.
export const SECTIONS = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "itr-filing", label: "Return of Income", icon: FiFileText },
  { id: "tax-planning", label: "Tax Planning", icon: FiTrendingUp },
  { id: "tax-advisory", label: "Tax Advisory", icon: FiBriefcase },
  { id: "tax-compliance", label: "Advance Tax & Self-Assessment", icon: FiCheckCircle },
  { id: "notice-assessment", label: "Assessment, Rectification & Appeals", icon: FiAlertCircle },
  { id: "business-tax", label: "Business Tax Consultation", icon: FiBarChart2 },
  { id: "process", label: "Process", icon: FiRepeat }

]
export const SECTION_IDS = SECTIONS.map((section) => section.id);
