// Primary navigation links shown in the header.
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Life @ SAA", to: "/life-at-saa" },
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
      { label: "TDS Compliance", to: "/" },
      { label: "Accounting & Bookkeeping", to: "/" },
      { label: "Audit & Assurance", to: "/" },
    ],
  },
  {
    title: "Corporate & Specialised Services",
    items: [
      { label: "Company & LLP Registration (ROC)", to: "/" },
      { label: "RERA Registration & Compliance", to: "/", badge: "Specialised" },
      { label: "Land Laws Consultancy (UPZLAR)", to: "/", badge: "Specialised" },
      { label: "Trust, NGO & Society Registration", to: "/" },
      { label: "Digital Signature Certificate (DSC)", to: "/" },
      { label: "Business Advisory & Company Formation", to: "/" },
    ],
  },
];
