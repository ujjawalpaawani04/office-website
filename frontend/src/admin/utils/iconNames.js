// Curated Feather icon names (react-icons/fi) for the admin Icon Picker.
// Every icon used anywhere in the live Services module today is included
// (so nothing already on a page is ever unavailable to re-select), plus a
// modest set of other common business/CA-firm-relevant icons. Deliberately
// not the full ~280-icon Feather set - a smaller, curated list is easier to
// search and browse than an unfiltered dump. Grouped only for a nicer
// browsing UI; search matches across all groups regardless.
export const ICON_GROUPS = [
  {
    label: "Documents & Filing",
    icons: [
      "FiFileText", "FiFilePlus", "FiFile", "FiClipboard", "FiEdit3", "FiBookOpen",
      "FiArchive", "FiFolder", "FiPrinter", "FiPaperclip",
    ],
  },
  {
    label: "Finance & Tax",
    icons: [
      "FiBarChart2", "FiPieChart", "FiTrendingUp", "FiTrendingDown", "FiPercent",
      "FiDollarSign", "FiCreditCard", "FiShoppingCart", "FiRepeat", "FiRefreshCw",
    ],
  },
  {
    label: "Compliance & Trust",
    icons: [
      "FiShield", "FiLock", "FiCheckCircle", "FiCheckSquare", "FiAlertTriangle",
      "FiAlertCircle", "FiEye", "FiSearch", "FiKey", "FiAward", "FiThumbsUp",
    ],
  },
  {
    label: "People & Business",
    icons: [
      "FiUser", "FiUserCheck", "FiUsers", "FiBriefcase", "FiHeadphones",
      "FiHeart", "FiHome", "FiTarget", "FiCompass", "FiGrid", "FiLayers",
    ],
  },
  {
    label: "Time & Process",
    icons: [
      "FiCalendar", "FiClock", "FiActivity", "FiZap", "FiSend", "FiTool",
      "FiCpu", "FiSettings", "FiPhoneCall", "FiMail", "FiGlobe",
    ],
  },
];

export const ALL_ICON_NAMES = ICON_GROUPS.flatMap((group) => group.icons);
