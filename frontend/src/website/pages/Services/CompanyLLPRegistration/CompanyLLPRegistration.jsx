import {
  FiFileText,
  FiUsers,
  FiUser,
  FiClipboard,
  FiUserCheck,
  FiKey,
  FiShield,
  FiCompass,
  FiPhoneCall,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiAward,
  FiHeadphones,
  FiLayers,
  FiClock,
  FiLock,
  FiZap,
  FiGrid,
  FiBriefcase,
  FiTool,
  FiHeart,
} from "react-icons/fi";
import { ServicePage } from "../serviceTemplate/ServicePage";

const config = {
  slug: "company-llp-registration",
  sidebarTitle: "Company & LLP Registration",
  hero: {
    breadcrumbLabel: "Company & LLP Registration",
    titlePre: "Company & LLP",
    titleHighlight: "Registration",
    description:
      "We provide end-to-end assistance with Private Limited Company, LLP and OPC incorporation, along with ROC annual filings and ongoing corporate compliance, helping you start and run your business on a solid legal foundation from day one.",
  },
  overview: {
    tagline: "Overview",
    headingPre: "A Reliable Partner for",
    headingHighlight: "Company & LLP Registration",
    paragraphs: [
      "Choosing the right business structure and getting it registered correctly is one of the most important decisions a founder makes. Whether it's a Private Limited Company, an LLP or an OPC, the entity you choose shapes your compliance obligations, tax position and ability to raise funds for years to come.",
      "We guide you through incorporation end to end, then keep you compliant with the Registrar of Companies year after year -so directors and partners can focus on running the business, not chasing paperwork.",
    ],
    highlights: [
      "Private Limited Company Incorporation",
      "LLP & OPC Registration",
      "ROC Annual Compliance",
      "Director KYC & DIN Support",
      "Personalised Guidance",
      "Transparent, Hassle-Free Process",
    ],
  },
  services: {
    headingPre: "Our Company & LLP",
    headingHighlight: "Registration Services",
    intro: "Everything your business needs to incorporate correctly and stay compliant with the ROC, under one roof.",
    items: [
      { icon: FiFileText, title: "Company Incorporation", description: "End-to-end Private Limited Company registration, done right the first time." },
      { icon: FiUsers, title: "LLP Registration", description: "Limited Liability Partnership formation with complete documentation support." },
      { icon: FiUser, title: "OPC Registration", description: "One Person Company incorporation for solo founders and promoters." },
      { icon: FiClipboard, title: "ROC Annual Filing", description: "Annual returns and financial statements filed accurately with the ROC." },
      { icon: FiUserCheck, title: "Director KYC", description: "Timely DIR-3 KYC filing to keep director records active and compliant." },
      { icon: FiKey, title: "DIN & DSC Assistance", description: "Director Identification Number and Digital Signature Certificate support." },
      { icon: FiShield, title: "Corporate Compliance", description: "Ongoing statutory compliance so your company never falls behind." },
      { icon: FiCompass, title: "Business Registration Advisory", description: "Guidance on choosing the right structure for your business goals." },
    ],
  },
  process: {
    intro: "A structured, transparent path from your first conversation with us to support long after incorporation.",
    steps: [
      { icon: FiPhoneCall, title: "Initial Consultation", description: "Understanding your business and the right structure for it." },
      { icon: FiSearch, title: "Requirement Analysis", description: "Assessing promoters, capital and structure requirements in detail." },
      { icon: FiClipboard, title: "Document Collection", description: "Gathering identity, address and registration documents needed." },
      { icon: FiEye, title: "Verification", description: "A careful check of every document before filing begins." },
      { icon: FiFileText, title: "Application / Registration", description: "Filing the incorporation application with the Registrar of Companies." },
      { icon: FiCheckCircle, title: "Compliance Review", description: "Confirming every post-incorporation requirement is in order." },
      { icon: FiAward, title: "Approval / Completion", description: "Certificate of incorporation and registration documents delivered." },
      { icon: FiHeadphones, title: "Ongoing Support", description: "Continued ROC compliance support long after registration." },
    ],
  },
  whyChooseUs: {
    intro: "We handle registration and compliance with the same care, from your first filing to every one after it.",
    imageAlt: "Chartered accountants assisting with company and LLP registration",
    reasons: [
      { icon: FiUserCheck, title: "Experienced Chartered Accountants", description: "A team well versed in company and LLP law." },
      { icon: FiLayers, title: "End-to-End Assistance", description: "From structure selection to ROC filing, fully managed." },
      { icon: FiShield, title: "Regulatory Expertise", description: "Filings that meet every Companies Act requirement." },
      { icon: FiFileText, title: "Accurate Documentation", description: "Paperwork prepared correctly the first time." },
      { icon: FiClock, title: "Timely Service Delivery", description: "Registrations and filings completed without delay." },
      { icon: FiEye, title: "Transparent Communication", description: "Clear updates at every stage of the process." },
      { icon: FiLock, title: "Confidential Handling", description: "Your business information kept strictly confidential." },
      { icon: FiHeadphones, title: "Dedicated Client Support", description: "A point of contact who knows your business." },
    ],
  },
  benefits: {
    tagline: "The Payoff",
    headingPre: "Benefits of Getting",
    headingHighlight: "Registration Right",
    intro: "A properly registered and compliant entity gives your business credibility, protection and room to grow.",
    items: [
      "Limited liability protection",
      "Improved business credibility",
      "Easier access to funding",
      "Clear legal structure",
      "Simplified ownership transfer",
      "Perpetual succession",
      "Reduced compliance risk",
      "Stronger stakeholder trust",
    ],
  },
  industries: {
    intro: "We register and support entities across every stage of business, from first-time founders to established groups.",
    items: [
      { icon: FiZap, label: "Startups", blurb: "Fast, founder-friendly incorporation." },
      { icon: FiGrid, label: "MSMEs", blurb: "Right-sized structures as you scale." },
      { icon: FiBriefcase, label: "Private Limited Companies", blurb: "Full incorporation and ROC support." },
      { icon: FiLayers, label: "LLPs", blurb: "Partnership-style flexibility, registered right." },
      { icon: FiUsers, label: "Partnership Firms", blurb: "Guidance on converting or registering afresh." },
      { icon: FiUserCheck, label: "Professionals", blurb: "Practice-friendly entity structures." },
      { icon: FiTool, label: "Manufacturing", blurb: "Structures suited to capital-intensive operations." },
      { icon: FiHeadphones, label: "Service Businesses", blurb: "Lean structures for service-led teams." },
      { icon: FiCompass, label: "Real Estate Developers", blurb: "Entities aligned with project requirements." },
      { icon: FiHeart, label: "Trusts & NGOs", blurb: "Advisory on the right structure for your mission." },
    ],
  },
  faqs: [
    {
      question: "Which is better -Private Limited Company or LLP?",
      answer:
        "It depends on your funding plans, ownership structure and compliance appetite. Private Limited Companies suit businesses planning to raise equity funding, while LLPs suit smaller, partner-run businesses wanting lower compliance. We help you choose based on your specific goals.",
    },
    {
      question: "How long does company incorporation take?",
      answer:
        "Once documents are in order, incorporation typically takes 7-15 working days, depending on name approval and Registrar processing times. We keep the process moving and flag delays early.",
    },
    {
      question: "What is ROC annual filing?",
      answer:
        "Every registered company and LLP must file annual returns and financial statements with the Registrar of Companies each year. Missing these filings attracts penalties, so we track and manage the calendar for you.",
    },
    {
      question: "Do I need a DIN and DSC to register a company?",
      answer:
        "Yes. Every proposed director needs a Director Identification Number and a Digital Signature Certificate to sign incorporation documents electronically. We handle both as part of the registration process.",
    },
    {
      question: "Can an LLP be converted into a Private Limited Company?",
      answer:
        "Yes, an LLP can be converted into a Private Limited Company as the business grows, subject to certain conditions and ROC procedures. We guide you through the conversion end to end.",
    },
    {
      question: "What happens if ROC compliance is missed?",
      answer:
        "Missed filings attract daily penalties and can eventually lead to the company or LLP being marked as non-compliant or struck off. We help you catch up on pending filings and stay current going forward.",
    },
    {
      question: "Do you assist with post-incorporation compliance?",
      answer:
        "Yes. Beyond registration, we manage ongoing ROC filings, director KYC, statutory registers and other corporate compliance requirements so nothing is missed after day one.",
    },
  ],
  cta: {
    heading: "Need Assistance with Company Registration?",
    description:
      "Get your Private Limited Company, LLP or OPC registered correctly and stay compliant with the Registrar of Companies year after year. Our experienced team manages the entire process, so you can focus on building your business.",
  },
};

const CompanyLLPRegistration = () => <ServicePage config={config} />;

export default CompanyLLPRegistration;
