// Single source of truth for the Insights & Articles blog: listing page,
// featured section, category filter, and individual article detail pages
// all read from this file so content stays consistent across the site.

export const categories = [
  { slug: "all", label: "All Articles" },
  { slug: "taxation", label: "Taxation" },
  { slug: "gst", label: "GST" },
  { slug: "audit", label: "Audit" },
  { slug: "compliance", label: "Compliance" },
  { slug: "advisory", label: "Advisory" },
];

export const getCategoryLabel = (slug) =>
  categories.find((category) => category.slug === slug)?.label ?? slug;

export const blogPosts = [
  {
    slug: "union-budget-2026-income-tax-changes",
    title: "Union Budget 2026: Key Income Tax Changes Every Taxpayer Should Know",
    category: "taxation",
    featured: true,
    image: "/blog/tax.png",
    excerpt:
      "A breakdown of the income tax changes announced in the Union Budget 2026 and what they mean for individual taxpayers and businesses.",
    metaDescription:
      "Understand the key income tax changes from Union Budget 2026 - revised slabs, deduction updates, and what salaried taxpayers and businesses should do next.",
    author: "Amit Singh",
    authorRole: "Founder & Managing Partner",
    publishedDate: "2026-07-10",
    publishedDisplay: "10 Jul 2026",
    readTime: "7 min read",
    content: [
      {
        id: "overview",
        heading: "Overview of the Budget Announcements",
        paragraphs: [
          "Every Union Budget brings a mix of continuity and change, and this year is no different. Alongside infrastructure and sector-specific announcements, the Finance Ministry introduced a handful of income tax changes that directly affect how much individuals and businesses will pay - and file - this year.",
          "Below, we break down the changes that matter most, without the jargon, so you can plan ahead instead of scrambling before the filing deadline.",
        ],
      },
      {
        id: "slabs",
        heading: "Changes to Income Tax Slabs",
        paragraphs: [
          "The revised slab structure under the new tax regime offers marginally higher relief in the middle-income brackets, effectively increasing take-home pay for many salaried employees. The old regime slabs remain unchanged, which means the decision between regimes is now even more dependent on your specific deduction profile.",
          "If you haven't compared both regimes against your actual investments and deductions in the last year or two, it's worth revisiting - the right choice can differ from what worked for you previously.",
        ],
      },
      {
        id: "deductions",
        heading: "Updates to Deductions and Exemptions",
        paragraphs: [
          "A few deduction limits have been adjusted, and one new deduction category has been introduced for specified retirement savings instruments. These changes are modest individually, but combined, they can shift the optimal tax-saving strategy for many taxpayers.",
        ],
      },
      {
        id: "salaried-impact",
        heading: "Impact on Salaried Taxpayers",
        paragraphs: [
          "For most salaried individuals, the net effect is a small reduction in tax outgo if you're on the new regime, provided your income falls within the revised bracket ranges. Employees should ask their HR or payroll team to confirm updated TDS calculations reflect the new slabs from the applicable date.",
        ],
      },
      {
        id: "business-impact",
        heading: "Impact on Businesses and Professionals",
        paragraphs: [
          "Presumptive taxation thresholds for small businesses and professionals have seen a modest upward revision, allowing more taxpayers to opt for simplified computation without maintaining detailed books. This is a welcome change for freelancers, consultants, and small trading businesses.",
        ],
      },
      {
        id: "next-steps",
        heading: "What You Should Do Next",
        paragraphs: [
          "Re-run your tax regime comparison for the current financial year, update your advance tax estimates if you pay them quarterly, and flag any changes to your payroll or accounting team early rather than at year-end. A short planning conversation now can prevent surprises at filing time.",
        ],
      },
    ],
    keyTakeaways: [
      "New tax regime slabs offer marginally higher relief for middle-income earners.",
      "Old regime slabs are unchanged - compare both regimes against your actual deductions.",
      "A new deduction category has been introduced for specified retirement savings.",
      "Presumptive taxation thresholds have increased, benefiting small businesses and professionals.",
    ],
  },
  {
    slug: "gst-compliance-changes-2026",
    title: "GST Compliance Changes You Need to Know in 2026",
    category: "gst",
    featured: true,
    image: "/blog/gst.png",
    excerpt:
      "Recent amendments to GST return filing, e-invoicing thresholds, and reconciliation requirements that businesses cannot afford to ignore.",
    metaDescription:
      "A practical guide to the latest GST compliance changes in 2026, covering e-invoicing thresholds, return filing timelines, and reconciliation requirements.",
    author: "Amit Singh",
    authorRole: "Founder & Managing Partner",
    publishedDate: "2026-07-02",
    publishedDisplay: "02 Jul 2026",
    readTime: "6 min read",
    content: [
      {
        id: "whats-changed",
        heading: "What's Changed in GST Compliance",
        paragraphs: [
          "GST compliance rules are revised frequently, and 2026 has already brought a handful of changes that affect how mid-sized and small businesses handle invoicing, filing, and reconciliation. Missing these updates can mean blocked input tax credit or late fees that are entirely avoidable.",
        ],
      },
      {
        id: "e-invoicing",
        heading: "E-Invoicing Threshold Revisions",
        paragraphs: [
          "The turnover threshold for mandatory e-invoicing has been lowered again, bringing more mid-sized businesses into its scope. If your turnover is approaching the revised limit, it's worth setting up e-invoicing systems proactively rather than waiting until it becomes mandatory for you.",
        ],
      },
      {
        id: "filing-timelines",
        heading: "Updated Return Filing Timelines",
        paragraphs: [
          "Filing windows for GSTR-1 and GSTR-3B have seen minor adjustments for certain taxpayer categories under the QRMP scheme. Double-check your applicable due dates rather than relying on last year's calendar, especially if your filing frequency recently changed.",
        ],
      },
      {
        id: "reconciliation",
        heading: "Reconciliation and Input Tax Credit Checks",
        paragraphs: [
          "Tighter matching rules between GSTR-2B and your purchase register mean that even small mismatches can now delay ITC claims. Monthly reconciliation, rather than a rushed exercise before the annual return, is quickly becoming the only practical approach.",
        ],
      },
      {
        id: "staying-compliant",
        heading: "How to Stay Compliant",
        paragraphs: [
          "Build a simple monthly checklist: reconcile ITC against GSTR-2B, verify e-invoice generation for eligible transactions, and confirm return filing before due dates. Where volumes are high, this is where a compliance partner earns their keep - catching mismatches before they become costly.",
        ],
      },
    ],
    keyTakeaways: [
      "The e-invoicing turnover threshold has been lowered - check if you're now in scope.",
      "GSTR-1 and GSTR-3B filing timelines have shifted for some QRMP taxpayers.",
      "ITC matching against GSTR-2B is stricter - monthly reconciliation is now essential.",
      "A simple monthly compliance checklist prevents most avoidable penalties.",
    ],
  },
  {
    slug: "legal-tax-planning-strategies",
    title: "5 Legal Tax Planning Strategies to Reduce Your Tax Liability",
    category: "taxation",
    featured: true,
    image: "/blog/taxation.png",
    excerpt:
      "Practical, fully compliant tax planning strategies individuals and business owners can use to legally reduce their tax outgo.",
    metaDescription:
      "Five legal, fully compliant tax planning strategies for individuals and business owners looking to reduce their tax liability in India.",
    author: "Amit Singh",
    authorRole: "Founder & Managing Partner",
    publishedDate: "2026-06-28",
    publishedDisplay: "28 Jun 2026",
    readTime: "6 min read",
    content: [
      {
        id: "why-plan",
        heading: "Why Tax Planning Matters",
        paragraphs: [
          "Tax planning isn't about aggressive avoidance - it's about legally structuring your income, investments, and expenses so you don't pay more tax than necessary. Done early in the financial year, it also removes the last-minute scramble to find eligible investments in March.",
        ],
      },
      {
        id: "section-80c",
        heading: "Maximise Section 80C and Beyond",
        paragraphs: [
          "Section 80C remains the most commonly used deduction, but many taxpayers don't fully utilise the limit, or stop there when other deductions - health insurance under 80D, NPS contributions under 80CCD(1B), and home loan interest under Section 24 - remain unused.",
        ],
      },
      {
        id: "income-structuring",
        heading: "Structure Your Income Efficiently",
        paragraphs: [
          "For professionals and business owners, how income is structured - salary versus professional fees, for instance - can materially change the effective tax rate. This is worth a dedicated conversation with your CA rather than a default choice.",
        ],
      },
      {
        id: "capital-gains",
        heading: "Plan Capital Gains Strategically",
        paragraphs: [
          "Timing the sale of investments, using indexation benefits where applicable, and offsetting gains against eligible losses can meaningfully reduce your capital gains tax. This requires planning across the year, not just at the point of sale.",
        ],
      },
      {
        id: "business-deductions",
        heading: "Don't Leave Business Deductions on the Table",
        paragraphs: [
          "Depreciation, eligible business expenses, and deductions for specified investments are frequently under-claimed simply because records aren't maintained well enough to support them. Good bookkeeping through the year is, in effect, a tax-saving strategy on its own.",
        ],
      },
    ],
    keyTakeaways: [
      "Start tax planning at the beginning of the financial year, not in March.",
      "Look beyond Section 80C - health insurance, NPS, and home loan interest add up.",
      "How you structure income as a professional can change your effective tax rate.",
      "Consistent bookkeeping ensures you don't under-claim legitimate business deductions.",
    ],
  },
  {
    slug: "gst-registration-guide-new-businesses",
    title: "GST Registration: A Complete Guide for New Businesses",
    category: "gst",
    featured: false,
    image: "/about-images/bg1.png",
    excerpt:
      "Everything a new business needs to know about GST registration - who needs it, documents required, and the step-by-step process.",
    metaDescription:
      "A complete guide to GST registration for new businesses in India - eligibility, required documents, and a step-by-step walkthrough of the process.",
    author: "Priya Sharma",
    authorRole: "Partner - Audit & Assurance",
    publishedDate: "2026-06-18",
    publishedDisplay: "18 Jun 2026",
    readTime: "6 min read",
    content: [
      {
        id: "who-needs",
        heading: "Who Needs GST Registration",
        paragraphs: [
          "GST registration becomes mandatory once your aggregate turnover crosses the prescribed threshold, which varies by state and category of supply. Certain businesses - such as those making inter-state supplies or selling through e-commerce platforms - must register regardless of turnover.",
        ],
      },
      {
        id: "documents",
        heading: "Documents You'll Need",
        paragraphs: [
          "At a minimum, you'll need PAN, proof of business constitution (partnership deed, incorporation certificate, etc.), address proof for your principal place of business, bank account details, and identity proof for authorised signatories. Missing or mismatched documents are the most common cause of application delays.",
        ],
      },
      {
        id: "process",
        heading: "The Registration Process, Step by Step",
        paragraphs: [
          "The process runs through the GST portal in two parts: generating a Temporary Reference Number (TRN) after initial verification, then completing the full application with document uploads. Once submitted, the application is typically processed within a few working days, subject to verification.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common Mistakes to Avoid",
        paragraphs: [
          "Address mismatches between documents, incorrect business activity codes, and incomplete authorised signatory details are the most frequent reasons applications get sent back for clarification. Reviewing every field against your supporting documents before submission saves weeks of back-and-forth.",
        ],
      },
      {
        id: "after-registration",
        heading: "After You're Registered",
        paragraphs: [
          "Once registered, you're required to start filing returns on schedule, issue GST-compliant invoices, and maintain proper records from day one - even before you have significant transaction volume. Setting up the right systems early makes ongoing compliance far easier.",
        ],
      },
    ],
    keyTakeaways: [
      "Registration is mandatory above the turnover threshold, or immediately for certain categories.",
      "Document mismatches are the leading cause of delayed applications.",
      "The process involves a TRN followed by full application and verification.",
      "Compliant invoicing and return filing obligations begin immediately after registration.",
    ],
  },
  {
    slug: "statutory-audit-guide",
    title: "What to Expect During a Statutory Audit: A Practical Guide",
    category: "audit",
    featured: false,
    image: "/blog/audit.png",
    excerpt:
      "A practical walkthrough of the statutory audit process to help businesses prepare and avoid last-minute surprises.",
    metaDescription:
      "A practical guide to the statutory audit process in India - what auditors examine, how to prepare, and how to avoid common audit findings.",
    author: "Priya Sharma",
    authorRole: "Partner - Audit & Assurance",
    publishedDate: "2026-06-10",
    publishedDisplay: "10 Jun 2026",
    readTime: "7 min read",
    content: [
      {
        id: "what-is-audit",
        heading: "What Is a Statutory Audit",
        paragraphs: [
          "A statutory audit is an independent examination of a company's financial statements, required by law for companies and certain other entities, regardless of size or profitability. Its purpose is to give stakeholders confidence that the financial statements present a true and fair view.",
        ],
      },
      {
        id: "preparation",
        heading: "Pre-Audit Preparation",
        paragraphs: [
          "Well-prepared businesses reconcile bank statements, close out pending journal entries, and organise supporting documentation before the audit team arrives. This single step often determines whether an audit takes days or weeks.",
        ],
      },
      {
        id: "what-auditors-examine",
        heading: "What Auditors Typically Examine",
        paragraphs: [
          "Expect scrutiny of revenue recognition, related-party transactions, inventory valuation, statutory dues, and internal controls around cash and approvals. Auditors will sample transactions and request supporting evidence, not just review summary reports.",
        ],
      },
      {
        id: "common-findings",
        heading: "Common Audit Findings and How to Avoid Them",
        paragraphs: [
          "Unreconciled ledger balances, missing supporting documentation, and inconsistent revenue cut-off practices are recurring findings across businesses of every size. Most of these are prevented by disciplined monthly closing rather than an annual clean-up.",
        ],
      },
      {
        id: "after-report",
        heading: "After the Audit Report",
        paragraphs: [
          "Once the report is issued, act on any observations promptly - unresolved findings tend to resurface, and sometimes worsen, in the following year's audit. Treat the management letter as a roadmap for tightening controls, not just a compliance formality.",
        ],
      },
    ],
    keyTakeaways: [
      "Statutory audit is mandatory for companies regardless of size or profitability.",
      "Pre-audit reconciliation is the single biggest factor in a smooth audit.",
      "Auditors sample and verify transactions - not just review summary figures.",
      "Address audit observations promptly to avoid recurring findings next year.",
    ],
  },
  {
    slug: "regulatory-compliance-updates-2026",
    title: "Key Regulatory Compliance Updates Every Business Must Track",
    category: "compliance",
    featured: false,
    image: "/blog/comp.png",
    excerpt:
      "A round-up of recent regulatory and compliance changes affecting Indian businesses across corporate, labour, and statutory filings.",
    metaDescription:
      "Stay ahead of recent regulatory compliance updates affecting Indian businesses, including corporate filings, labour law, and sector-specific changes.",
    author: "Meera Patel",
    authorRole: "Partner - Operations & Growth",
    publishedDate: "2026-05-30",
    publishedDisplay: "30 May 2026",
    readTime: "5 min read",
    content: [
      {
        id: "why-track",
        heading: "Why Compliance Tracking Matters",
        paragraphs: [
          "Regulatory requirements change more often than most businesses realise, and penalties for missed filings are rarely proportional to the effort it would have taken to comply on time. A structured tracking process is far cheaper than catching up after a notice arrives.",
        ],
      },
      {
        id: "corporate-filings",
        heading: "Corporate Filing Updates",
        paragraphs: [
          "Recent changes to ROC filing formats and disclosure requirements mean companies should review their annual filing checklist rather than assume last year's process still applies unchanged.",
        ],
      },
      {
        id: "labour-payroll",
        heading: "Labour and Payroll Compliance Changes",
        paragraphs: [
          "Updates to provident fund and professional tax reporting have introduced new validation checks that can reject filings over minor formatting mismatches. Payroll teams should reconcile employee master data before the next filing cycle.",
        ],
      },
      {
        id: "sector-specific",
        heading: "Sector-Specific Regulatory Updates",
        paragraphs: [
          "Certain sectors - including NBFCs, real estate, and import-export businesses - face additional reporting obligations that have been tightened recently. If you operate in a regulated sector, a sector-specific compliance review is worth scheduling annually.",
        ],
      },
      {
        id: "compliance-calendar",
        heading: "Building a Compliance Calendar",
        paragraphs: [
          "The most effective safeguard is a single compliance calendar covering tax, GST, ROC, and labour filings with owners and deadlines clearly assigned. It sounds simple, but very few businesses actually maintain one consistently.",
        ],
      },
    ],
    keyTakeaways: [
      "Compliance requirements change frequently - don't assume last year's process still applies.",
      "ROC filing formats and payroll reporting have both seen recent updates.",
      "Regulated sectors like NBFCs and real estate face additional reporting obligations.",
      "A single, owned compliance calendar prevents most missed deadlines.",
    ],
  },
  {
    slug: "startup-financial-planning-guide",
    title: "Startup Financial Planning: A Practical Guide for Founders",
    category: "advisory",
    featured: false,
    image: "/blog/advisory.png",
    excerpt:
      "A practical financial planning framework for early-stage founders covering budgeting, runway, and building investor-ready books.",
    metaDescription:
      "A practical financial planning guide for startup founders - budgeting, managing runway, and building investor-ready books from day one.",
    author: "Rajesh Kumar",
    authorRole: "Partner - Strategic Advisory",
    publishedDate: "2026-05-20",
    publishedDisplay: "20 May 2026",
    readTime: "6 min read",
    content: [
      {
        id: "why-early",
        heading: "Why Financial Planning Matters Early",
        paragraphs: [
          "Founders often postpone financial planning until fundraising forces the issue, by which point bad habits are already baked into the business. Getting the basics right from day one saves significant time - and credibility - later.",
        ],
      },
      {
        id: "budget-runway",
        heading: "Building a Realistic Budget and Runway",
        paragraphs: [
          "A realistic budget starts with your actual burn rate, not an optimistic projection. Track it monthly, model at least two scenarios, and know your runway in months at all times - not just when a board meeting is approaching.",
        ],
      },
      {
        id: "investor-ready-books",
        heading: "Setting Up Books That Investors Trust",
        paragraphs: [
          "Clean, timely books are one of the fastest ways to build investor confidence, and their absence is one of the fastest ways to lose it during due diligence. Set up proper accounting systems before you need them, not during a term sheet negotiation.",
        ],
      },
      {
        id: "cash-flow",
        heading: "Managing Cash Flow as You Scale",
        paragraphs: [
          "As revenue grows, cash flow timing becomes more complex than the top-line numbers suggest - receivables, vendor payments, and payroll all compete for the same cash. A rolling cash flow forecast, updated monthly, catches problems while they're still manageable.",
        ],
      },
      {
        id: "professional-help",
        heading: "When to Bring In Professional Help",
        paragraphs: [
          "Most founders benefit from professional financial support earlier than they expect - not to replace their judgement, but to free their time for the parts of the business only they can do. If financial admin is consuming founder hours, it's usually time to delegate it properly.",
        ],
      },
    ],
    keyTakeaways: [
      "Track your actual burn rate and runway monthly, not just before board meetings.",
      "Investor due diligence moves faster - and trust builds faster - with clean, timely books.",
      "A rolling cash flow forecast catches timing problems before they become urgent.",
      "Bring in professional financial support before it becomes a fundraising bottleneck.",
    ],
  },
  {
    slug: "income-tax-return-filing-guide-fy2025-26",
    title: "Income Tax Return Filing: A Step-by-Step Guide for FY 2025-26",
    category: "taxation",
    featured: false,
    image: "/blog/taxation2.png",
    excerpt:
      "A step-by-step guide to filing your income tax return for FY 2025-26, including document checklists and common mistakes to avoid.",
    metaDescription:
      "Step-by-step guide to filing your income tax return for FY 2025-26 - document checklist, choosing the right ITR form, and mistakes to avoid.",
    author: "Amit Singh",
    authorRole: "Founder & Managing Partner",
    publishedDate: "2026-05-08",
    publishedDisplay: "08 May 2026",
    readTime: "6 min read",
    content: [
      {
        id: "who-and-when",
        heading: "Who Needs to File and By When",
        paragraphs: [
          "Filing is mandatory if your income exceeds the basic exemption limit, and advisable in several other situations - claiming a refund, carrying forward losses, or maintaining a clean filing history for loan applications. Know your due date, since penalties and interest apply immediately after it passes.",
        ],
      },
      {
        id: "documents",
        heading: "Documents You'll Need",
        paragraphs: [
          "Form 16, bank interest certificates, capital gains statements, proof of deductions claimed, and your AIS/26AS statement are the core documents most taxpayers need. Reconciling your AIS against your own records before filing prevents mismatches that can trigger notices later.",
        ],
      },
      {
        id: "choosing-form",
        heading: "Choosing the Right ITR Form",
        paragraphs: [
          "Using the wrong ITR form is a common and entirely avoidable error - the correct form depends on your income sources, not just your income level. Salaried individuals with only salary and interest income need a different form than those with capital gains or business income.",
        ],
      },
      {
        id: "filing-steps",
        heading: "Step-by-Step Filing Process",
        paragraphs: [
          "Gather your documents, reconcile them against your AIS/26AS, select the correct form, fill in and validate every schedule, and e-verify the return promptly after submission - an unverified return is treated as not filed at all.",
        ],
      },
      {
        id: "common-mistakes",
        heading: "Common Mistakes That Trigger Notices",
        paragraphs: [
          "Mismatched income figures, unreported interest income, and incorrect deduction claims are the most common triggers for scrutiny notices. Most are avoidable simply by reconciling every figure against your AIS before submitting.",
        ],
      },
    ],
    keyTakeaways: [
      "Filing is mandatory above the exemption limit, and useful even when it isn't.",
      "Reconcile your AIS/26AS against your own records before you file.",
      "Choosing the correct ITR form depends on your income sources, not just income level.",
      "An unverified return is treated as not filed - always complete e-verification.",
    ],
  },
];

export const getPostBySlug = (slug) => blogPosts.find((post) => post.slug === slug);

export const getRelatedPosts = (post, limit = 3) => {
  const sameCategory = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category === post.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, limit);
};
