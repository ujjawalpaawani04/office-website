import {
  FiHome,
  FiUser,
  FiFileText,
  FiClipboard,
  FiCompass,
  FiRefreshCw,
  FiArchive,
  FiRepeat,
  FiPhoneCall,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiAward,
  FiHeadphones,
  FiUserCheck,
  FiLayers,
  FiShield,
  FiClock,
  FiLock,
  FiZap,
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiTool,
  FiHeart,
} from "react-icons/fi";
import { ServicePage } from "../serviceTemplate/ServicePage";

const config = {
  slug: "rera-registration",
  sidebarTitle: "RERA Registration",
  hero: {
    breadcrumbLabel: "RERA Registration & Compliance",
    titlePre: "RERA Registration &",
    titleHighlight: "Compliance",
    description:
      "We provide professional assistance for builders, developers and real estate projects with RERA registration and ongoing regulatory compliance, helping projects stay transparent, credible and fully aligned with applicable real estate laws.",
  },
  overview: {
    tagline: "Overview",
    headingPre: "Dependable RERA Support for",
    headingHighlight: "Builders & Developers",
    paragraphs: [
      "The Real Estate (Regulation and Development) Act exists to bring transparency and accountability to real estate transactions -but the registration and ongoing filing requirements can be detailed and time-sensitive for builders and developers.",
      "We manage project and builder registration, documentation and periodic compliance filings so your projects stay on the right side of RERA at every stage, from launch to completion and handover.",
    ],
    highlights: [
      "Project Registration",
      "Builder Registration",
      "Quarterly Compliance Filing",
      "Regulatory Advisory",
      "Renewal Support",
      "Transparent, Hassle-Free Process",
    ],
  },
  services: {
    headingPre: "Our RERA Registration &",
    headingHighlight: "Compliance Services",
    intro: "Everything a real estate project needs to register, file and stay compliant with RERA, under one roof.",
    items: [
      { icon: FiHome, title: "Project Registration", description: "End-to-end RERA registration for new real estate projects." },
      { icon: FiUser, title: "Builder Registration", description: "Registration support for builders and real estate agents." },
      { icon: FiFileText, title: "Documentation", description: "Preparing the documents and disclosures RERA registration requires." },
      { icon: FiClipboard, title: "Compliance Filing", description: "Periodic project updates and compliance filings kept on schedule." },
      { icon: FiCompass, title: "Regulatory Advisory", description: "Guidance on applicable RERA rules for your specific project." },
      { icon: FiRefreshCw, title: "Renewal Support", description: "Timely renewal of project registration before it lapses." },
      { icon: FiArchive, title: "Record Maintenance", description: "Project records maintained in the form RERA expects." },
      { icon: FiRepeat, title: "Ongoing Compliance", description: "Continuous monitoring so no filing deadline is missed." },
    ],
  },
  process: {
    intro: "A structured, transparent path from your first conversation with us to support long after registration.",
    steps: [
      { icon: FiPhoneCall, title: "Initial Consultation", description: "Understanding your project and its registration requirements." },
      { icon: FiSearch, title: "Requirement Analysis", description: "Reviewing project size, timelines and applicable RERA obligations." },
      { icon: FiClipboard, title: "Document Collection", description: "Gathering project, land and promoter documentation." },
      { icon: FiEye, title: "Verification", description: "A careful review of every disclosure before filing." },
      { icon: FiFileText, title: "Application / Registration", description: "Filing the project or builder registration application." },
      { icon: FiCheckCircle, title: "Compliance Review", description: "Confirming ongoing filing and disclosure requirements are met." },
      { icon: FiAward, title: "Approval / Completion", description: "Registration certificate obtained and shared with you." },
      { icon: FiHeadphones, title: "Ongoing Support", description: "Continued compliance support through the project lifecycle." },
    ],
  },
  whyChooseUs: {
    intro: "We bring the same discipline to every RERA filing, from first registration to project completion.",
    imageAlt: "Real estate compliance review meeting for a RERA registered project",
    reasons: [
      { icon: FiUserCheck, title: "Experienced Chartered Accountants", description: "A team familiar with real estate regulatory requirements." },
      { icon: FiLayers, title: "End-to-End Assistance", description: "From registration to renewal, fully managed for you." },
      { icon: FiShield, title: "Regulatory Expertise", description: "Filings that align with the latest RERA requirements." },
      { icon: FiFileText, title: "Accurate Documentation", description: "Disclosures and records prepared correctly." },
      { icon: FiClock, title: "Timely Service Delivery", description: "Registrations and renewals completed on schedule." },
      { icon: FiEye, title: "Transparent Communication", description: "Clear visibility into filing status at every stage." },
      { icon: FiLock, title: "Confidential Handling", description: "Project and financial information kept confidential." },
      { icon: FiHeadphones, title: "Dedicated Client Support", description: "A point of contact who understands your project." },
    ],
  },
  benefits: {
    tagline: "The Payoff",
    headingPre: "Benefits of Staying",
    headingHighlight: "RERA Compliant",
    intro: "RERA compliance protects your project's credibility and keeps buyer trust intact.",
    items: [
      "Legal recognition of your project",
      "Increased buyer confidence",
      "Avoidance of penalties and delays",
      "Transparent project disclosures",
      "Smoother approvals and renewals",
      "Stronger market credibility",
      "Reduced regulatory risk",
      "Better project governance",
    ],
  },
  industries: {
    intro: "We support real estate stakeholders of every size, from independent builders to large development groups.",
    items: [
      { icon: FiHome, label: "Real Estate Developers", blurb: "Project registration handled end to end." },
      { icon: FiZap, label: "Startups", blurb: "First-time developer registration support." },
      { icon: FiGrid, label: "MSMEs", blurb: "Right-sized compliance for smaller projects." },
      { icon: FiBriefcase, label: "Private Limited Companies", blurb: "Corporate developer registrations managed." },
      { icon: FiLayers, label: "LLPs", blurb: "LLP-structured project entities supported." },
      { icon: FiUsers, label: "Partnership Firms", blurb: "Partnership-run projects registered correctly." },
      { icon: FiUserCheck, label: "Professionals", blurb: "Real estate agent registration support." },
      { icon: FiTool, label: "Manufacturing", blurb: "Compliance for industrial real estate projects." },
      { icon: FiHeadphones, label: "Service Businesses", blurb: "Commercial project compliance handled." },
      { icon: FiHeart, label: "Trusts & NGOs", blurb: "Guidance for trust-owned developments." },
    ],
  },
  faqs: [
    {
      question: "Which real estate projects require RERA registration?",
      answer:
        "Most residential and commercial projects above the prescribed plot size or unit threshold must be registered with RERA before advertising, marketing, booking or selling any unit. We assess whether your specific project falls within scope.",
    },
    {
      question: "How long does RERA project registration take?",
      answer:
        "Once the application and documents are complete, most state RERA authorities process registration within 30 days, absent any deficiency. We prepare the filing to minimise back-and-forth queries.",
    },
    {
      question: "What ongoing compliance does RERA require?",
      answer:
        "Registered projects must file quarterly progress updates, maintain a separate project bank account, and keep disclosures on the RERA portal current until the project is completed and handed over.",
    },
    {
      question: "Can RERA registration be renewed?",
      answer:
        "Yes. If a project isn't completed within the registered timeline, builders can apply for an extension or renewal, subject to the applicable state RERA rules. We manage the renewal filing on your behalf.",
    },
    {
      question: "Do individual real estate agents need RERA registration?",
      answer:
        "Yes. Real estate agents facilitating the sale or purchase of RERA-registered projects are generally required to register separately as agents under RERA.",
    },
    {
      question: "What happens if a project isn't RERA registered?",
      answer:
        "Selling or advertising an unregistered project that requires RERA registration can attract significant penalties and legal action. We help you register before any marketing or booking activity begins.",
    },
    {
      question: "Can you help with buyer complaints or RERA disputes?",
      answer:
        "Yes. We assist in preparing documentation and compliance records that support your position in the event of a buyer complaint or RERA authority inquiry.",
    },
  ],
  cta: {
    heading: "Need Professional RERA Registration Assistance?",
    description:
      "Keep your real estate project transparent, credible and fully compliant with RERA. Our experienced team manages registration, documentation and ongoing filings, so you can focus on delivering your project.",
  },
};

const RERARegistration = () => <ServicePage config={config} />;

export default RERARegistration;
