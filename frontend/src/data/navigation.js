// Primary navigation links shown in the header.
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Life@SAA", to: "/life-at-saa" },
  { label: "Career", to: "/career" },
  { label: "Blog", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

// Mega-menu content for the "Services" nav item, grouped by column.
// Each item may set `badge` to surface it as a highlighted/featured service.
export const servicesMenu = [
  {
    title: "Our Services",
    items: [
      { label: "Income Tax & Tax Advisory", to: "/services/income-tax-advisory" },
      { label: "GST Services", to: "/services/gst-services" },
      { label: "TDS Compliance", to: "/services/tds-compliance" },
      { label: "Accounting & Bookkeeping", to: "/services/accounting-bookkeeping" },
      { label: "Audit & Assurance", to: "/services/audit-assurance" },
    ],
  },
  {
    title: "Corporate & Specialised Services",
    items: [
      { label: "Company & LLP Registration (ROC)", to: "/services/company-llp-registration" },
      { label: "RERA Registration & Compliance", to: "/services/rera-registration", badge: "Specialised" },
      { label: "Land Laws Consultancy (UPZLAR)", to: "/services/land-laws-consultancy", badge: "Specialised" },
      { label: "Trust, NGO & Society Registration", to: "/services/trust-ngo-registration" },
      { label: "Digital Signature Certificate (DSC)", to: "/services/digital-signature-certificate" },
      { label: "Business Advisory & Company Formation", to: "/services/business-advisory" },
    ],
  },
];

// Shared by the desktop and mobile Services menus so both apply the exact
// same rule for which item counts as "active". Placeholder items still
// pointing at "/" (no dedicated route yet) never match, same as elsewhere
// in the nav - otherwise they'd falsely light up on the homepage.
export const isServicesMenuItemActive = (pathname, to) => to !== "/" && pathname === to;
