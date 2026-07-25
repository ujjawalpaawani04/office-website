import {
  FiCompass,
  FiFileText,
  FiBookOpen,
  FiShield,
  FiArchive,
  FiHome,
  FiClipboard,
  FiUsers,
  FiPhoneCall,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiAward,
  FiHeadphones,
  FiUserCheck,
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
  slug: "land-laws-consultancy",
  sidebarTitle: "Land Laws Consultancy",
  hero: {
    breadcrumbLabel: "Land Laws Consultancy (UPZLAR)",
    titlePre: "Land Laws",
    titleHighlight: "Consultancy",
    description:
      "We provide specialised consultancy related to the Uttar Pradesh Zamindari Abolition and Land Reforms Act (UPZLAR), guiding individuals, businesses and developers through applicable land law matters, documentation and government procedures with clarity and confidence.",
  },
  overview: {
    tagline: "Overview",
    headingPre: "Specialised Guidance on",
    headingHighlight: "Land Law Matters",
    paragraphs: [
      "Land law in India, and particularly matters governed by the Zamindari Abolition and Land Reforms Act, involves layered regulations, historical records and government procedures that are easy to get wrong without specialised guidance.",
      "We help clients navigate land classification, conversion, documentation and compliance requirements under applicable land laws, so property matters are handled correctly from the outset and stand up to scrutiny later.",
    ],
    highlights: [
      "Land Law Consultation",
      "Property Documentation",
      "Land Records Advisory",
      "Government Procedure Support",
      "Personalised Guidance",
      "Transparent, Hassle-Free Process",
    ],
  },
  services: {
    headingPre: "Our Land Laws",
    headingHighlight: "Consultancy Services",
    intro: "Everything you need to understand, document and comply with applicable land law requirements, under one roof.",
    items: [
      { icon: FiCompass, title: "Land Law Consultation", description: "Expert guidance on applicable land law provisions for your matter." },
      { icon: FiFileText, title: "Property Documentation", description: "Preparation and review of documentation related to land holdings." },
      { icon: FiBookOpen, title: "Legal Guidance", description: "Clear explanation of your rights and obligations under land law." },
      { icon: FiShield, title: "Regulatory Compliance", description: "Ensuring land-related matters meet applicable regulatory requirements." },
      { icon: FiArchive, title: "Land Records Advisory", description: "Guidance on verifying and updating land revenue records." },
      { icon: FiHome, title: "Government Procedures", description: "Support navigating applications and processes with land authorities." },
      { icon: FiClipboard, title: "Documentation Support", description: "Assembling the paperwork government procedures require." },
      { icon: FiUsers, title: "Advisory Services", description: "Ongoing advisory for individuals, businesses and developers." },
    ],
  },
  process: {
    intro: "A structured, transparent path from your first conversation with us to support through every procedure.",
    steps: [
      { icon: FiPhoneCall, title: "Initial Consultation", description: "Understanding your land matter and its specific requirements." },
      { icon: FiSearch, title: "Requirement Analysis", description: "Reviewing land classification, records and applicable provisions." },
      { icon: FiClipboard, title: "Document Collection", description: "Gathering land records, title documents and supporting papers." },
      { icon: FiEye, title: "Verification", description: "Careful review of records and documentation for accuracy." },
      { icon: FiFileText, title: "Application / Registration", description: "Preparing and filing applications with the relevant authority." },
      { icon: FiCheckCircle, title: "Compliance Review", description: "Confirming the matter meets every applicable requirement." },
      { icon: FiAward, title: "Approval / Completion", description: "Following the matter through to resolution or approval." },
      { icon: FiHeadphones, title: "Ongoing Support", description: "Continued advisory for any follow-up land matters." },
    ],
  },
  whyChooseUs: {
    intro: "We bring specialised, region-specific land law expertise to every consultation we take on.",
    imageAlt: "Land records and property documentation review for a land law consultation",
    reasons: [
      { icon: FiUserCheck, title: "Experienced Chartered Accountants", description: "A team familiar with land law and property matters." },
      { icon: FiLayers, title: "End-to-End Assistance", description: "From consultation to documentation, fully managed." },
      { icon: FiShield, title: "Regulatory Expertise", description: "Guidance grounded in the applicable land law provisions." },
      { icon: FiFileText, title: "Accurate Documentation", description: "Paperwork prepared carefully and correctly." },
      { icon: FiClock, title: "Timely Service Delivery", description: "Matters progressed without unnecessary delay." },
      { icon: FiEye, title: "Transparent Communication", description: "Clear updates on where your matter stands." },
      { icon: FiLock, title: "Confidential Handling", description: "Property and personal details kept confidential." },
      { icon: FiHeadphones, title: "Dedicated Client Support", description: "A point of contact who understands your matter." },
    ],
  },
  benefits: {
    tagline: "The Payoff",
    headingPre: "Benefits of Expert",
    headingHighlight: "Land Law Guidance",
    intro: "Getting land matters right the first time avoids costly disputes and delays later.",
    items: [
      "Clarity on land classification and title",
      "Reduced risk of legal disputes",
      "Accurate, defensible documentation",
      "Smoother government approvals",
      "Better-informed property decisions",
      "Protection of ownership rights",
      "Faster resolution of land matters",
      "Practical, region-specific guidance",
    ],
  },
  industries: {
    intro: "We advise individuals, businesses and developers on land matters across a range of use cases.",
    items: [
      { icon: FiHome, label: "Real Estate Developers", blurb: "Land classification and title guidance." },
      { icon: FiZap, label: "Startups", blurb: "Land-related due diligence support." },
      { icon: FiGrid, label: "MSMEs", blurb: "Documentation for owned or leased land." },
      { icon: FiBriefcase, label: "Private Limited Companies", blurb: "Corporate land holding matters advised on." },
      { icon: FiLayers, label: "LLPs", blurb: "Land documentation for LLP-owned assets." },
      { icon: FiUsers, label: "Partnership Firms", blurb: "Guidance on jointly held land matters." },
      { icon: FiUserCheck, label: "Professionals", blurb: "Personal property and land advisory." },
      { icon: FiTool, label: "Manufacturing", blurb: "Land conversion and use guidance." },
      { icon: FiHeadphones, label: "Service Businesses", blurb: "Leasehold and premises documentation." },
      { icon: FiHeart, label: "Trusts & NGOs", blurb: "Land matters for trust-held property." },
    ],
  },
  faqs: [
    {
      question: "What is the Zamindari Abolition and Land Reforms Act?",
      answer:
        "It is state legislation enacted to abolish the zamindari system and reform land tenure, governing land classification, tenancy rights and revenue records in the applicable state. We advise on how its provisions apply to your specific land matter.",
    },
    {
      question: "Do I need to verify land records before purchasing property?",
      answer:
        "Yes. Verifying land classification, revenue records and title history before purchase helps avoid disputes and ensures the land can be legally used for your intended purpose. We assist with this verification.",
    },
    {
      question: "Can agricultural land be converted for other use?",
      answer:
        "In many cases, agricultural land can be converted for residential, commercial or industrial use through the prescribed government procedure, subject to state rules and eligibility. We guide you through the conversion process.",
    },
    {
      question: "What documents are typically required for land matters?",
      answer:
        "Common documents include revenue records, sale deeds, mutation records, and identity proofs, though the exact list depends on the specific matter. We provide a tailored checklist once we understand your requirement.",
    },
    {
      question: "Can you help with disputed land records?",
      answer:
        "Yes. We help clients understand discrepancies in land records, prepare documentation to support correction applications, and guide them through the applicable government procedure.",
    },
    {
      question: "How long do land law matters typically take to resolve?",
      answer:
        "Timelines vary widely depending on the nature of the matter and the government authority involved, from a few weeks for straightforward applications to longer for matters requiring verification or dispute resolution.",
    },
    {
      question: "Do you provide ongoing advisory for land holdings?",
      answer:
        "Yes. Beyond one-time consultations, we offer ongoing advisory support for businesses and individuals holding land assets that require periodic compliance or documentation updates.",
    },
  ],
  cta: {
    heading: "Need Expert Land Law Consultancy?",
    description:
      "Navigate land classification, documentation and government procedures with confidence. Our experienced team provides clear, practical guidance on land law matters so your property decisions are well informed and legally sound.",
  },
};

const LandLawsConsultancy = () => <ServicePage config={config} />;

export default LandLawsConsultancy;
