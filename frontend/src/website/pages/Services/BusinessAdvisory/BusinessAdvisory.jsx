import {
  FiCompass,
  FiZap,
  FiFileText,
  FiLayers,
  FiTrendingUp,
  FiShield,
  FiBarChart2,
  FiHeadphones,
  FiPhoneCall,
  FiSearch,
  FiClipboard,
  FiEye,
  FiCheckCircle,
  FiAward,
  FiUserCheck,
  FiClock,
  FiLock,
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiTool,
  FiHeart,
  FiHome,
} from "react-icons/fi";
import { ServicePage } from "../serviceTemplate/ServicePage";

const config = {
  slug: "business-advisory",
  sidebarTitle: "Business Advisory & Formation",
  hero: {
    breadcrumbLabel: "Business Advisory & Company Formation",
    titlePre: "Business Advisory &",
    titleHighlight: "Company Formation",
    description:
      "We provide end-to-end guidance for startups and new businesses, from selecting the right business structure to registration, business planning and ongoing compliance, helping founders build on a solid foundation from day one.",
  },
  overview: {
    tagline: "Overview",
    headingPre: "Trusted Guidance for",
    headingHighlight: "Startups & Growing Businesses",
    paragraphs: [
      "Every business decision -from the legal structure you choose to how you plan for growth -has consequences that compound over time. Getting expert advice early saves founders from costly restructuring and compliance headaches later.",
      "We work with founders from the very first conversation, helping you choose the right structure, get registered, plan for growth and stay compliant as the business scales -so you can focus on building, not untangling avoidable problems.",
    ],
    highlights: [
      "Business Structure Advisory",
      "Startup & Company Registration",
      "Business Planning Support",
      "Regulatory Compliance",
      "Personalised Guidance",
      "Transparent, Hassle-Free Process",
    ],
  },
  services: {
    headingPre: "Our Business Advisory &",
    headingHighlight: "Company Formation Services",
    intro: "Everything a founder needs to structure, register and grow a business, under one roof.",
    items: [
      { icon: FiCompass, title: "Business Structure Advisory", description: "Guidance on choosing the right legal structure for your goals." },
      { icon: FiZap, title: "Startup Registration", description: "End-to-end registration support tailored for new businesses." },
      { icon: FiFileText, title: "Company Formation", description: "Private Limited Company incorporation, done correctly and quickly." },
      { icon: FiLayers, title: "LLP Formation", description: "Limited Liability Partnership registration for partner-run businesses." },
      { icon: FiTrendingUp, title: "Business Planning Support", description: "Practical input on financial planning and growth strategy." },
      { icon: FiShield, title: "Regulatory Compliance", description: "Keeping your business compliant as it registers and scales." },
      { icon: FiBarChart2, title: "Growth Advisory", description: "Ongoing guidance as your business moves into its next stage." },
      { icon: FiHeadphones, title: "Ongoing Business Support", description: "A dependable advisor available well beyond formation." },
    ],
  },
  process: {
    intro: "A structured, transparent path from your first conversation with us to support long after formation.",
    steps: [
      { icon: FiPhoneCall, title: "Initial Consultation", description: "Understanding your business idea and long-term goals." },
      { icon: FiSearch, title: "Requirement Analysis", description: "Assessing the right structure, capital and compliance needs." },
      { icon: FiClipboard, title: "Document Collection", description: "Gathering promoter and registration documentation." },
      { icon: FiEye, title: "Verification", description: "A careful review of every document before filing." },
      { icon: FiFileText, title: "Application / Registration", description: "Filing the incorporation or registration application." },
      { icon: FiCheckCircle, title: "Compliance Review", description: "Confirming every post-formation requirement is in order." },
      { icon: FiAward, title: "Approval / Completion", description: "Registration completed and documents handed over." },
      { icon: FiHeadphones, title: "Ongoing Support", description: "Continued advisory as your business grows." },
    ],
  },
  whyChooseUs: {
    intro: "We advise founders the way we'd want to be advised -clearly, practically, and with the long term in mind.",
    imageAlt: "Business advisors discussing company formation strategy with a founder",
    reasons: [
      { icon: FiUserCheck, title: "Experienced Chartered Accountants", description: "A team that has guided founders across many industries." },
      { icon: FiLayers, title: "End-to-End Assistance", description: "From structure selection to ongoing compliance, fully managed." },
      { icon: FiShield, title: "Regulatory Expertise", description: "Advice grounded in current company and tax law." },
      { icon: FiFileText, title: "Accurate Documentation", description: "Registration paperwork prepared correctly the first time." },
      { icon: FiClock, title: "Timely Service Delivery", description: "Formation completed quickly, so you can start operating." },
      { icon: FiEye, title: "Transparent Communication", description: "Clear, jargon-free advice at every stage." },
      { icon: FiLock, title: "Confidential Handling", description: "Your business plans and data kept strictly confidential." },
      { icon: FiHeadphones, title: "Dedicated Client Support", description: "A point of contact who understands your business." },
    ],
  },
  benefits: {
    tagline: "The Payoff",
    headingPre: "Benefits of Expert",
    headingHighlight: "Business Advisory",
    intro: "The right advice at formation stage saves founders time, money and avoidable compliance risk later.",
    items: [
      "The right structure from day one",
      "Faster, error-free registration",
      "Clear compliance roadmap",
      "Better financial planning",
      "Reduced risk of costly restructuring",
      "Stronger investor readiness",
      "Practical growth guidance",
      "A dependable long-term advisor",
    ],
  },
  industries: {
    intro: "We advise founders and growing businesses across every stage and sector.",
    items: [
      { icon: FiZap, label: "Startups", blurb: "Structure and registration guidance from day one." },
      { icon: FiGrid, label: "MSMEs", blurb: "Right-sized advisory as the business scales." },
      { icon: FiBriefcase, label: "Private Limited Companies", blurb: "Formation and governance support." },
      { icon: FiLayers, label: "LLPs", blurb: "Partnership-structured business formation." },
      { icon: FiUsers, label: "Partnership Firms", blurb: "Advisory on formalising and growing the firm." },
      { icon: FiUserCheck, label: "Professionals", blurb: "Practice formation and structuring advice." },
      { icon: FiTool, label: "Manufacturing", blurb: "Formation guidance for capital-intensive setups." },
      { icon: FiHeadphones, label: "Service Businesses", blurb: "Lean structures for service-led founders." },
      { icon: FiHome, label: "Real Estate Developers", blurb: "Entity structuring for project-based businesses." },
      { icon: FiHeart, label: "Trusts & NGOs", blurb: "Advisory on mission-aligned structures." },
    ],
  },
  faqs: [
    {
      question: "What business structure should I choose for a new startup?",
      answer:
        "It depends on your funding plans, number of founders, and risk appetite -Private Limited Companies suit businesses planning to raise equity, while LLPs and proprietorships suit smaller, founder-run setups. We assess your specific situation before recommending a structure.",
    },
    {
      question: "How long does company or LLP formation take?",
      answer:
        "Once documents are ready, formation typically takes 7-15 working days depending on name approval and government processing times. We keep the process moving and flag any delays early.",
    },
    {
      question: "Do you help with business planning, not just registration?",
      answer:
        "Yes. Beyond formation, we advise on financial planning, budgeting and growth strategy, so the business is set up to scale, not just to exist on paper.",
    },
    {
      question: "Can I convert my proprietorship into a Private Limited Company later?",
      answer:
        "Yes. Many businesses start as a proprietorship or partnership and convert into a Private Limited Company as they grow, subject to certain conditions. We guide you through the conversion when the time is right.",
    },
    {
      question: "What ongoing compliance does a new company need?",
      answer:
        "New companies must maintain statutory registers, file annual returns with the ROC, handle director KYC, and meet applicable tax filing deadlines. We manage this compliance calendar so nothing is missed.",
    },
    {
      question: "Do you advise on investor readiness?",
      answer:
        "Yes. We help structure your company's cap table, agreements and financial records in a way that stands up to investor due diligence when you're ready to raise funding.",
    },
    {
      question: "Can you support the business after formation is complete?",
      answer:
        "Yes. We stay on as an ongoing advisor for compliance, tax planning and growth-stage decisions, rather than disappearing once the registration certificate is issued.",
    },
  ],
  cta: {
    heading: "Need Expert Business Advisory Services?",
    description:
      "Choose the right business structure, register correctly, and get practical guidance as your business grows. Our experienced team supports founders from the very first conversation through every stage that follows.",
  },
};

const BusinessAdvisory = () => <ServicePage config={config} />;

export default BusinessAdvisory;
