// Mirrors frontend/src/website/pages/Appointment/appointmentServices.js's
// keys/labels - kept as a small local map (rather than importing across the
// website/admin boundary) since the admin panel only ever needs the label,
// never the icon or description.
export const SERVICE_LABELS = {
  income_tax: "Income Tax Consultation",
  gst: "GST Consultation",
  tds: "TDS Compliance",
  audit: "Audit & Assurance",
  accounting: "Accounting & Bookkeeping",
  company_llp: "Company & LLP Compliance",
  roc_filing: "ROC Filing",
  rera: "RERA Consultation",
  trust_ngo: "Trust, Society & NGO Registration",
  advisory: "Business & Financial Advisory",
  general: "General Consultation",
};
