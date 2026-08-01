// Single source of truth for the Life@SAA "Insights & Articles" showcase
// AND the individual article detail pages (/insights/:slug) - both read
// from this file so nothing drifts out of sync. Kept flat and centralized
// so this array can later be swapped for an admin-panel-backed API
// response without touching any component that consumes it.
//
// Layout note: the showcase renders these 9 as one full-width row per
// article - each row pairs that article's own content card with its own
// video card (see InsightsArticles.jsx). Do not reorder this array;
// article order on the page follows array order.
//
// VIDEO NOTE: every article currently points at the same placeholder file
// (public/article/"Akshit Arora-.mp4", confirmed with the site owner as
// the intended source - encoded below since the filename contains a
// space). Replacing a single article's video later means editing only
// that entry's `video` field.
const PLACEHOLDER_VIDEO = "/article/Akshit%20Arora-.mp4";

export const insightsArticles = [
  {
    id: 1,
    name: "Income Tax Planning for FY 2024-25",
    title: "Income Tax Planning for FY 2024-25",
    slug: "income-tax-planning-fy-2024-25",
    description:
      "Key exemptions, deductions and planning strategies to optimise your tax outgo before the financial year closes.",
    batch: "Tax & Compliance",
    category: "Income Tax",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-07-18",
    publishedDisplay: "18 Jul 2026",
    status: "published",
    content: [
      "Effective tax planning is most valuable when it happens throughout the year, not in the final weeks before filing - by then, many of the more useful options have already closed.",
      "A short mid-year review of your investments, deductions claimed so far, and any regime change under consideration gives you time to actually act on what you find.",
      "Where your income situation has changed materially during the year - a new source of income, a large one-off gain - it's worth revisiting your estimated tax liability rather than assuming last year's numbers still apply.",
    ],
  },
  {
    id: 2,
    name: "GST Compliance Checklist for Businesses",
    title: "GST Compliance Checklist for Businesses",
    slug: "gst-compliance-checklist-for-businesses",
    description: "A quick walkthrough of the monthly GST compliance checklist every business should follow.",
    batch: "GST & Compliance",
    category: "GST",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-07-12",
    publishedDisplay: "12 Jul 2026",
    status: "published",
    content: [
      "A consistent monthly routine - matching purchase records against GSTR-2B before filing, rather than after - catches most input tax credit mismatches while they're still easy to fix.",
      "Return filing deadlines are only part of the compliance picture; reconciling books against filed returns each quarter prevents small gaps from becoming a larger notice later.",
      "Businesses that build this checklist into their regular accounting cycle, rather than treating it as a separate task, tend to spend far less time on corrections.",
    ],
  },
  {
    id: 3,
    name: "TDS Return Filing - Key Points",
    title: "TDS Return Filing - Key Points",
    slug: "tds-return-filing-key-points",
    description:
      "What return filers need to check before submitting quarterly TDS statements to avoid common defaults.",
    batch: "TDS & Withholding Tax",
    category: "TDS",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-07-05",
    publishedDisplay: "05 Jul 2026",
    status: "published",
    content: [
      "Quarterly TDS statements are rejected or flagged far more often for avoidable reasons - a mismatched challan, an incorrect PAN, or a missed correction from the previous quarter - than for genuine calculation errors.",
      "Reconciling deductions against Form 26AS before filing catches most of these issues while there's still time to correct them without penalty.",
      "Where a default has already occurred, filing the correction promptly limits the interest that continues to accrue on the outstanding amount.",
    ],
  },
  {
    id: 4,
    name: "Audit Documentation - Best Practices",
    title: "Audit Documentation - Best Practices",
    slug: "audit-documentation-best-practices",
    description: "A short overview of the documentation habits that make statutory audits go smoothly.",
    batch: "Audit & Assurance",
    category: "Audit",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-06-28",
    publishedDisplay: "28 Jun 2026",
    status: "published",
    content: [
      "A well-prepared audit begins long before the auditor's first visit - bank reconciliations, fixed asset registers, and statutory registers should already be current.",
      "Auditors typically request the same core set of documents each year; maintaining a standing checklist internally shortens the overall audit timeline considerably.",
      "Early, organised preparation also reduces the likelihood of last-minute audit observations that could otherwise have been resolved in advance.",
    ],
  },
  {
    id: 5,
    name: "Business Advisory for Startups",
    title: "Business Advisory for Startups",
    slug: "business-advisory-for-startups",
    description:
      "Practical financial and structuring guidance for early-stage businesses navigating their first few years.",
    batch: "Business Advisory",
    category: "Business Advisory",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-06-20",
    publishedDisplay: "20 Jun 2026",
    status: "published",
    content: [
      "The financial decisions made in a startup's first two years - how it's structured, how founder contributions are recorded, how early expenses are tracked - tend to have an outsized effect on how easy due diligence is later.",
      "Founders often postpone formal bookkeeping until it becomes unavoidable; starting even a lightweight version early saves considerable cleanup work before a funding round or audit.",
      "Regular, structured conversations with an advisor - not just at tax time - help catch structuring or compliance issues while they're still simple to fix.",
    ],
  },
  {
    id: 6,
    name: "Company Compliance Calendar",
    title: "Company Compliance Calendar",
    slug: "company-compliance-calendar",
    description: "A quick reference walkthrough of the recurring compliance dates companies need to track.",
    batch: "Corporate Compliance",
    category: "Corporate Compliance",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-06-14",
    publishedDisplay: "14 Jun 2026",
    status: "published",
    content: [
      "Private limited companies carry a fixed annual cycle of ROC filings - annual returns, financial statement filings, and director-related disclosures among them.",
      "Missing a filing deadline attracts an additional government fee that increases the longer the delay continues, making early tracking worthwhile.",
      "A simple internal calendar mapped to each filing's due date removes most of the last-minute pressure around compliance season.",
    ],
  },
  {
    id: 7,
    name: "RERA Compliance for Developers",
    title: "RERA Compliance for Developers",
    slug: "rera-compliance-for-developers",
    description:
      "Registration, disclosure and ongoing compliance obligations real estate developers need to track under RERA.",
    batch: "RERA & Real Estate",
    category: "RERA",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-06-08",
    publishedDisplay: "08 Jun 2026",
    status: "published",
    content: [
      "RERA registration is often treated as a one-time formality, but the ongoing obligations - quarterly progress updates, maintaining a separate project account - are what regulators actually monitor most closely.",
      "Promoters who set up a simple internal calendar for these recurring disclosures tend to avoid the compliance lapses that put a project's registration status at risk.",
      "Any change to project timelines or specifications should be reflected in RERA filings promptly, since a mismatch between public disclosures and actual project status is a common source of disputes.",
    ],
  },
  {
    id: 8,
    name: "Accounting Standards - An Overview",
    title: "Accounting Standards - An Overview",
    slug: "accounting-standards-an-overview",
    description: "A brief overview of how applicable accounting standards shape financial reporting.",
    batch: "Accounting & Finance",
    category: "Accounting",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-06-01",
    publishedDisplay: "01 Jun 2026",
    status: "published",
    content: [
      "Applicable accounting standards determine how transactions are recognised and measured, which is why two businesses with similar operations can still report meaningfully different numbers.",
      "Understanding which standards apply to your entity size and type matters most at the point of setting up your books, not after financial statements are already prepared.",
      "Consistent application year over year is usually more valuable to lenders and investors than any single standard's specific treatment.",
    ],
  },
  {
    id: 9,
    name: "Financial Management for SMEs",
    title: "Financial Management for SMEs",
    slug: "financial-management-for-smes",
    description:
      "Core financial management practices that help small and medium enterprises stay audit-ready and growth-ready.",
    batch: "Financial Management",
    category: "Financial Management",
    video: PLACEHOLDER_VIDEO,
    publishedDate: "2026-05-24",
    publishedDisplay: "24 May 2026",
    status: "published",
    content: [
      "Cash flow visibility - not just profitability - is usually the more urgent concern for a growing SME, and the two can tell very different stories in the same period.",
      "A simple monthly review of receivables ageing, upcoming payables and current cash position gives founders an early warning that a quarterly profit-and-loss statement alone won't.",
      "Businesses that maintain this discipline consistently tend to move through lender due diligence and annual audits with far fewer surprises.",
    ],
  },
];

export const getArticleBySlug = (slug) => insightsArticles.find((article) => article.slug === slug) ?? null;

export const getRelatedArticles = (article, count = 3) => {
  const others = insightsArticles.filter((a) => a.id !== article.id);
  const sameCategory = others.filter((a) => a.category === article.category);
  return (sameCategory.length > 0 ? sameCategory : others).slice(0, count);
};
