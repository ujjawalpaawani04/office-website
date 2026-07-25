import {
  FiFilePlus,
  FiRefreshCw,
  FiShield,
  FiUserCheck,
  FiBriefcase,
  FiTool,
  FiCpu,
  FiHeadphones,
  FiPhoneCall,
  FiSearch,
  FiClipboard,
  FiEye,
  FiCheckCircle,
  FiAward,
  FiLayers,
  FiClock,
  FiLock,
  FiZap,
  FiGrid,
  FiUsers,
  FiHeart,
  FiHome,
  FiFileText,
} from "react-icons/fi";
import { ServicePage } from "../serviceTemplate/ServicePage";

const config = {
  slug: "digital-signature-certificate",
  sidebarTitle: "Digital Signature Certificate",
  hero: {
    breadcrumbLabel: "Digital Signature Certificate (DSC)",
    titlePre: "Digital Signature",
    titleHighlight: "Certificate",
    description:
      "We provide fast, reliable assistance with Digital Signature Certificate applications and renewals for individuals, professionals and companies, helping you sign filings, contracts and government submissions securely and without delay.",
  },
  overview: {
    tagline: "Overview",
    headingPre: "Fast, Reliable Support for",
    headingHighlight: "Digital Signature Certificates",
    paragraphs: [
      "A Digital Signature Certificate is now a basic requirement for directors, professionals and businesses -needed to file ROC forms, income tax returns, GST filings and countless other government submissions securely online.",
      "We manage the entire application and renewal process, including identity verification, document preparation and token setup, so you're never stuck waiting on a DSC when a filing deadline is approaching.",
    ],
    highlights: [
      "New DSC Application",
      "DSC Renewal",
      "Class 3 & Director DSC",
      "Installation & Token Support",
      "Personalised Guidance",
      "Transparent, Hassle-Free Process",
    ],
  },
  services: {
    headingPre: "Our Digital Signature",
    headingHighlight: "Certificate Services",
    intro: "Everything you need to obtain, renew and use your Digital Signature Certificate, under one roof.",
    items: [
      { icon: FiFilePlus, title: "New DSC Application", description: "Fresh DSC applications processed quickly for individuals and entities." },
      { icon: FiRefreshCw, title: "DSC Renewal", description: "Timely renewal so your certificate never lapses mid-filing." },
      { icon: FiShield, title: "Class 3 DSC", description: "Class 3 certificates for e-tendering, e-filing and secure transactions." },
      { icon: FiUserCheck, title: "Director DSC", description: "DSC issuance for company directors and authorised signatories." },
      { icon: FiBriefcase, title: "Professional DSC", description: "Certificates tailored for CAs, CS and other professionals." },
      { icon: FiTool, title: "Installation Support", description: "Guided installation on your system so signing works first time." },
      { icon: FiCpu, title: "Token Configuration", description: "USB token setup and driver configuration handled for you." },
      { icon: FiHeadphones, title: "Technical Assistance", description: "Ongoing support for any signing or token issues that arise." },
    ],
  },
  process: {
    intro: "A structured, transparent path from your first conversation with us to support long after issuance.",
    steps: [
      { icon: FiPhoneCall, title: "Initial Consultation", description: "Understanding who needs the DSC and for what purpose." },
      { icon: FiSearch, title: "Requirement Analysis", description: "Confirming the right class and validity period for your need." },
      { icon: FiClipboard, title: "Document Collection", description: "Gathering identity and address proof for verification." },
      { icon: FiEye, title: "Verification", description: "Video or in-person verification as required by the certifying authority." },
      { icon: FiFileText, title: "Application / Registration", description: "Submitting the application to the certifying authority." },
      { icon: FiCheckCircle, title: "Compliance Review", description: "Confirming the certificate meets your filing requirements." },
      { icon: FiAward, title: "Approval / Completion", description: "DSC issued and token configured for immediate use." },
      { icon: FiHeadphones, title: "Ongoing Support", description: "Continued help with installation, renewal and troubleshooting." },
    ],
  },
  whyChooseUs: {
    intro: "We keep DSC issuance quick and painless, so you're never stuck at a filing deadline.",
    imageAlt: "Professional completing a Digital Signature Certificate application process",
    reasons: [
      { icon: FiUserCheck, title: "Experienced Chartered Accountants", description: "A team that handles DSC applications daily." },
      { icon: FiLayers, title: "End-to-End Assistance", description: "From application to installation, fully managed." },
      { icon: FiShield, title: "Regulatory Expertise", description: "Applications processed per certifying authority norms." },
      { icon: FiFileText, title: "Accurate Documentation", description: "Paperwork prepared correctly to avoid rejection." },
      { icon: FiClock, title: "Timely Service Delivery", description: "Certificates issued quickly, ahead of your deadline." },
      { icon: FiEye, title: "Transparent Communication", description: "Clear updates on application and verification status." },
      { icon: FiLock, title: "Confidential Handling", description: "Identity documents and tokens handled securely." },
      { icon: FiHeadphones, title: "Dedicated Client Support", description: "A point of contact for setup and renewal questions." },
    ],
  },
  benefits: {
    tagline: "The Payoff",
    headingPre: "Benefits of a Valid",
    headingHighlight: "Digital Signature",
    intro: "A valid, correctly configured DSC keeps your filings moving without last-minute scrambles.",
    items: [
      "Secure, legally valid e-signing",
      "Uninterrupted ROC and tax filings",
      "Faster government submissions",
      "Reduced risk of missed deadlines",
      "Protection against signature fraud",
      "Easy e-tendering participation",
      "Smooth multi-entity signing",
      "Hassle-free renewal reminders",
    ],
  },
  industries: {
    intro: "We issue and renew DSCs for individuals and organisations across every sector.",
    items: [
      { icon: FiZap, label: "Startups", blurb: "Director DSC issued from day one." },
      { icon: FiGrid, label: "MSMEs", blurb: "Quick turnaround for growing teams." },
      { icon: FiBriefcase, label: "Private Limited Companies", blurb: "DSCs for every authorised signatory." },
      { icon: FiLayers, label: "LLPs", blurb: "Partner DSC issuance and renewal." },
      { icon: FiUsers, label: "Partnership Firms", blurb: "Signing certificates for authorised partners." },
      { icon: FiUserCheck, label: "Professionals", blurb: "CA, CS and consultant DSC support." },
      { icon: FiTool, label: "Manufacturing", blurb: "DSCs for e-tendering and filings." },
      { icon: FiHeadphones, label: "Service Businesses", blurb: "Fast issuance for signing contracts." },
      { icon: FiHome, label: "Real Estate Developers", blurb: "DSCs for RERA and regulatory filings." },
      { icon: FiHeart, label: "Trusts & NGOs", blurb: "Trustee DSC issuance handled smoothly." },
    ],
  },
  faqs: [
    {
      question: "What is a Digital Signature Certificate used for?",
      answer:
        "A DSC is used to sign documents electronically for ROC filings, income tax returns, GST filings, e-tendering and other government submissions, giving the document the same legal validity as a handwritten signature.",
    },
    {
      question: "What is the difference between Class 3 and other DSC classes?",
      answer:
        "Class 3 DSCs offer the highest level of assurance and are required for e-tendering, e-auctions and most regulatory filings today, having largely replaced the older Class 2 category.",
    },
    {
      question: "How long is a DSC valid for?",
      answer:
        "DSCs are typically issued with a validity of one to three years. We track your certificate's expiry and reach out ahead of time so renewal happens before it lapses.",
    },
    {
      question: "What documents are required for a DSC application?",
      answer:
        "Generally you need identity proof, address proof, a photograph and, for organisational DSCs, authorisation documents from the company or LLP. We confirm the exact list based on your specific requirement.",
    },
    {
      question: "Is video verification mandatory for DSC issuance?",
      answer:
        "Most certifying authorities now require a brief video verification as part of the identity confirmation process. We guide you through this step so it goes smoothly on the first attempt.",
    },
    {
      question: "Can you help if my DSC token isn't working?",
      answer:
        "Yes. We provide technical assistance for token driver installation, browser configuration and signing issues, so your DSC works reliably when you need to file.",
    },
    {
      question: "Do directors of multiple companies need separate DSCs?",
      answer:
        "No, a single DSC issued to an individual can generally be used to sign filings across all companies and LLPs where they are an authorised signatory, provided it is properly registered on each portal.",
    },
  ],
  cta: {
    heading: "Need a Digital Signature Certificate?",
    description:
      "Get a new DSC issued or your existing certificate renewed quickly, with full installation and token support included. Our experienced team keeps your filings moving without delay.",
  },
};

const DigitalSignatureCertificate = () => <ServicePage config={config} />;

export default DigitalSignatureCertificate;
