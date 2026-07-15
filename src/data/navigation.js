// Primary navigation links shown in the header.
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Due Diligence", to: "/" },
  { label: "Publications", to: "/" },
  { label: "Our Advantage", to: "/" },
  { label: "Blog", to: "/" },
  { label: "Contact Us", to: "/contact" },
];

// Mega-menu content for the "Services" nav item, grouped by column.
// A column may have either a flat `items` list or nested `groups`.
export const servicesMenu = [
  {
    title: "Company Registration",
    items: [
      "Company Registration",
      "Company Incorporation",
      "Start-Up India",
      "Foreign Subsidiaries",
      "Private Limited Companies",
      "Limited Companies",
      "Limited Liability Partnership",
      "Overseas Direct Investments",
      "MSME Registration",
      "Trademark Registration",
      "Partnership Registration",
      "Proprietorship Registration",
    ],
  },
  {
    title: "Outsourcing",
    items: [
      "Accounts Outsourcing",
      "Payroll Outsourcing",
      "Corporate Compliance Outsourcing",
      "HR Functions Outsourcing",
      "Legal Consultancy",
      "Litigation Support Outsourcing",
      "SAP Outsourcing",
    ],
  },
  {
    title: "Taxation",
    groups: [
      {
        title: "Direct Tax",
        items: [
          "Direct Tax",
          "Corporate & Individual Taxation",
          "Capital Gains Taxation",
          "Taxation Of Expats",
        ],
      },
      {
        title: "Indirect Tax",
        items: ["GST", "Exports From India – Refund Or Rebate", "Customs Duty"],
      },
    ],
  },
  {
    title: "Auditing",
    items: [
      "Financial Statement Audit",
      "Internal Audit",
      "Process Audit",
      "Stock Audit",
      "Statutory Compliance",
      "HR Audit",
      "Marketing Communications",
      "TDS Audit",
      "Management Audit",
      "Data Security Audit",
    ],
  },
  {
    title: "Reporting",
    items: [
      "Corporate Reporting",
      "IFRS Reporting",
      "Business Sustainability",
      "POSH Reporting",
      "Internal Financial Controls",
      "Transfer Pricing",
      "FEMA Reporting",
    ],
  },
  {
    title: "Special Areas",
    items: [
      "Virtual CFO Services",
      "Share Based Payments",
      "POSH Trainings",
      "GST Refunds",
      "Agreement & Deed Drafting",
      "Resident Director Services",
      "Societies And NGO Services",
      "Acquisition Transaction",
      "Fraud Detection",
      "Risk Management",
      "Business Process Re-Engineering",
      "Unique Document Identification Number (UDIN)",
    ],
  },
];
