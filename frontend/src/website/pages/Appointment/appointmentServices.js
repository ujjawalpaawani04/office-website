import {
  FiFileText,
  FiPercent,
  FiRepeat,
  FiShield,
  FiBookOpen,
  FiBriefcase,
  FiClipboard,
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiMessageCircle,
  FiMapPin,
  FiPhoneCall,
  FiVideo,
} from "react-icons/fi";

// Presentation only (label/description/icon) - which of these is actually
// bookable is decided by the backend (GET /api/appointments/services),
// since that depends on whether a Calendly event type is configured; the
// `key` here must match the backend's SERVICE_KEYS exactly.
export const APPOINTMENT_SERVICES = [
  {
    key: "income_tax",
    label: "Income Tax Consultation",
    description: "Return filing, assessments and tax planning.",
    icon: FiFileText,
  },
  {
    key: "gst",
    label: "GST Consultation",
    description: "Registration, periodic returns and input tax credit matters.",
    icon: FiPercent,
  },
  {
    key: "tds",
    label: "TDS Compliance",
    description: "Quarterly statements, corrections and TRACES matters.",
    icon: FiRepeat,
  },
  {
    key: "audit",
    label: "Audit & Assurance",
    description: "Statutory, tax and internal audit requirements.",
    icon: FiShield,
  },
  {
    key: "accounting",
    label: "Accounting & Bookkeeping",
    description: "Financial statements and ongoing bookkeeping support.",
    icon: FiBookOpen,
  },
  {
    key: "company_llp",
    label: "Company & LLP Compliance",
    description: "Incorporation and annual compliance for companies and LLPs.",
    icon: FiBriefcase,
  },
  {
    key: "roc_filing",
    label: "ROC Filing",
    description: "Annual returns and event-based filings with the Registrar of Companies.",
    icon: FiClipboard,
  },
  {
    key: "rera",
    label: "RERA Consultation",
    description: "Project and promoter registration and compliance.",
    icon: FiHome,
  },
  {
    key: "trust_ngo",
    label: "Trust, Society & NGO Registration",
    description: "Registration and compliance for trusts, societies and NGOs.",
    icon: FiUsers,
  },
  {
    key: "advisory",
    label: "Business & Financial Advisory",
    description: "Strategic and financial advisory for your business.",
    icon: FiTrendingUp,
  },
  {
    key: "general",
    label: "General Consultation",
    description: "Not sure which category fits? Start here.",
    icon: FiMessageCircle,
  },
];

export const MEETING_MODES = [
  { key: "office", label: "Office Meeting", description: "Meet our team in person at our office.", icon: FiMapPin },
  { key: "phone", label: "Phone Consultation", description: "A scheduled call at your chosen time.", icon: FiPhoneCall },
  { key: "video", label: "Video Consultation", description: "Meet online via a video call link.", icon: FiVideo },
];
