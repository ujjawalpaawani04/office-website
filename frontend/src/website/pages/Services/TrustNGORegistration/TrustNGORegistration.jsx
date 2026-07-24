import {
  FiHeart,
  FiUsers,
  FiUserCheck,
  FiFileText,
  FiShield,
  FiClipboard,
  FiEdit3,
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
  FiHome,
} from "react-icons/fi";
import { ServicePage } from "../serviceTemplate/ServicePage";

const config = {
  slug: "trust-ngo-registration",
  sidebarTitle: "Trust, NGO & Society Registration",
  hero: {
    breadcrumbLabel: "Trust, NGO & Society Registration",
    titlePre: "Trust, NGO &",
    titleHighlight: "Society Registration",
    description:
      "We support the registration and ongoing regulatory compliance of trusts, NGOs and societies, helping founders and trustees set up a credible, legally sound organisation built to attract funding and serve its mission with confidence.",
  },
  overview: {
    tagline: "Overview",
    headingPre: "Trusted Guidance for",
    headingHighlight: "Trust, NGO & Society Registration",
    paragraphs: [
      "Trusts, NGOs and societies operate under distinct legal frameworks, each with its own registration process, governing documents and ongoing compliance obligations. Getting the structure and paperwork right at the outset makes every filing, audit and funding application that follows far smoother.",
      "We help founders and trustees choose the right structure, prepare the governing documents, complete registration, and stay compliant year after year -so your organisation can focus on its mission with a credible legal foundation behind it.",
    ],
    highlights: [
      "Trust Registration",
      "NGO & Society Registration",
      "Annual Compliance Filings",
      "Amendment Assistance",
      "Personalised Guidance",
      "Transparent, Hassle-Free Process",
    ],
  },
  services: {
    headingPre: "Our Trust, NGO & Society",
    headingHighlight: "Registration Services",
    intro: "Everything your organisation needs to register, document and stay compliant, under one roof.",
    items: [
      { icon: FiHeart, title: "Trust Registration", description: "End-to-end registration of public and private charitable trusts." },
      { icon: FiUsers, title: "NGO Registration", description: "Guidance and filing support for non-governmental organisations." },
      { icon: FiUserCheck, title: "Society Registration", description: "Registration under the Societies Registration Act, done correctly." },
      { icon: FiFileText, title: "Documentation", description: "Trust deeds, MOAs and bylaws drafted to match your objectives." },
      { icon: FiShield, title: "Compliance Support", description: "Ongoing regulatory compliance for registered organisations." },
      { icon: FiClipboard, title: "Annual Filings", description: "Statutory returns and filings completed on schedule every year." },
      { icon: FiEdit3, title: "Amendment Assistance", description: "Updating governing documents as your organisation evolves." },
      { icon: FiCompass, title: "Regulatory Advisory", description: "Guidance on applicable laws for your specific organisation type." },
    ],
  },
  process: {
    intro: "A structured, transparent path from your first conversation with us to support long after registration.",
    steps: [
      { icon: FiPhoneCall, title: "Initial Consultation", description: "Understanding your mission and the right structure for it." },
      { icon: FiSearch, title: "Requirement Analysis", description: "Assessing objectives, governance and applicable registration route." },
      { icon: FiClipboard, title: "Document Collection", description: "Gathering trustee, member and address documentation." },
      { icon: FiEye, title: "Verification", description: "A careful review of governing documents before filing." },
      { icon: FiFileText, title: "Application / Registration", description: "Filing the registration application with the relevant authority." },
      { icon: FiCheckCircle, title: "Compliance Review", description: "Confirming post-registration obligations are understood and met." },
      { icon: FiAward, title: "Approval / Completion", description: "Registration certificate obtained and shared with you." },
      { icon: FiHeadphones, title: "Ongoing Support", description: "Continued compliance support as your organisation grows." },
    ],
  },
  whyChooseUs: {
    intro: "We understand the unique governance and compliance needs of mission-driven organisations.",
    imageAlt: "Trustees and advisors reviewing NGO and society registration documents",
    reasons: [
      { icon: FiUserCheck, title: "Experienced Chartered Accountants", description: "A team familiar with trust and NGO regulations." },
      { icon: FiLayers, title: "End-to-End Assistance", description: "From structure selection to annual filings, fully managed." },
      { icon: FiShield, title: "Regulatory Expertise", description: "Registrations that meet every applicable legal requirement." },
      { icon: FiFileText, title: "Accurate Documentation", description: "Trust deeds and bylaws drafted with care." },
      { icon: FiClock, title: "Timely Service Delivery", description: "Registrations completed without unnecessary delay." },
      { icon: FiEye, title: "Transparent Communication", description: "Clear updates throughout the registration process." },
      { icon: FiLock, title: "Confidential Handling", description: "Trustee and organisational details kept confidential." },
      { icon: FiHeadphones, title: "Dedicated Client Support", description: "A point of contact who understands your mission." },
    ],
  },
  benefits: {
    tagline: "The Payoff",
    headingPre: "Benefits of Proper",
    headingHighlight: "Registration & Compliance",
    intro: "A well-registered, compliant organisation is better positioned to raise funds and earn public trust.",
    items: [
      "Legal recognition of your organisation",
      "Eligibility for tax exemptions",
      "Easier access to grants and donations",
      "Stronger donor and public trust",
      "Clear governance structure",
      "Reduced compliance risk",
      "Smoother audits and reporting",
      "Long-term organisational stability",
    ],
  },
  industries: {
    intro: "We support mission-driven organisations and the businesses that partner with them.",
    items: [
      { icon: FiHeart, label: "Trusts & NGOs", blurb: "Registration and compliance handled end to end." },
      { icon: FiZap, label: "Startups", blurb: "Foundation and CSR-arm registration support." },
      { icon: FiGrid, label: "MSMEs", blurb: "Guidance on CSR and giving structures." },
      { icon: FiBriefcase, label: "Private Limited Companies", blurb: "Corporate foundation setup and compliance." },
      { icon: FiLayers, label: "LLPs", blurb: "Advisory on associated charitable structures." },
      { icon: FiUsers, label: "Partnership Firms", blurb: "Guidance on related philanthropic entities." },
      { icon: FiUserCheck, label: "Professionals", blurb: "Personal trust and estate planning support." },
      { icon: FiTool, label: "Manufacturing", blurb: "CSR trust registration for industrial groups." },
      { icon: FiHome, label: "Real Estate Developers", blurb: "Trust structures for property-linked giving." },
      { icon: FiCompass, label: "Service Businesses", blurb: "Advisory on setting up a giving arm." },
    ],
  },
  faqs: [
    {
      question: "What is the difference between a trust, NGO and society?",
      answer:
        "A trust is formed through a trust deed to manage assets for a charitable purpose, a society is formed by a group of members under the Societies Registration Act, and NGO is a broader term covering non-profit organisations that may be structured as a trust, society or Section 8 company. We help you choose the right structure for your goals.",
    },
    {
      question: "Which structure is best for receiving foreign donations?",
      answer:
        "Receiving foreign contributions requires FCRA registration regardless of structure, though eligibility and process can differ. We advise on the right structure and guide you through the FCRA registration process where applicable.",
    },
    {
      question: "What documents are needed to register a trust or society?",
      answer:
        "Typically you need identity and address proof of trustees or members, a trust deed or memorandum of association, and proof of the registered address. We prepare a checklist specific to your organisation and jurisdiction.",
    },
    {
      question: "Do trusts and societies need to file annual returns?",
      answer:
        "Yes. Depending on the structure and applicable state law, annual returns, financial statements and, in many cases, income tax filings are required to maintain good standing and any tax exemption status.",
    },
    {
      question: "Can the objectives of a trust or society be changed later?",
      answer:
        "Yes, governing documents can generally be amended through a formal procedure, though the process and approvals required vary by structure and state. We assist with drafting and filing the amendment.",
    },
    {
      question: "How do I get 12A and 80G registration for tax exemption?",
      answer:
        "12A registration exempts the organisation's income from tax, while 80G allows donors to claim a deduction for their contributions. Both require separate applications to the Income Tax Department, which we help you prepare and file.",
    },
    {
      question: "How long does registration typically take?",
      answer:
        "Timelines vary by structure and state, but most trust, NGO and society registrations are completed within a few weeks once documentation is in order. We keep the process moving and flag any delays early.",
    },
  ],
  cta: {
    heading: "Need Help Registering Your Trust or NGO?",
    description:
      "Set up your trust, NGO or society on a solid legal foundation and stay compliant year after year. Our experienced team manages registration, documentation and ongoing filings, so you can focus on your mission.",
  },
};

const TrustNGORegistration = () => <ServicePage config={config} />;

export default TrustNGORegistration;
