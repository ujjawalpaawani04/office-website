"""Seed service-page content (hero/overview/features/process/why-choose-us/
benefits/industries/FAQs) for 8 service pages into the database, transcribed
verbatim from the React source files that currently hardcode this copy:

  - CompanyLLPRegistration, RERARegistration, LandLawsConsultancy,
    TrustNGORegistration, DigitalSignatureCertificate, BusinessAdvisory
    (each a `config` object passed to the shared `<ServicePage />` template)
  - AccountingBookkeeping, AuditAssurance
    (bespoke hardcoded component trees under their own `components/` folders)

Run with:  backend\\venv\\Scripts\\python.exe backend\\scripts\\seed_service_pages.py

Idempotent: each Service row is looked up by its `slug` (natural key) and
updated in place if it already exists; every child collection (FAQs,
benefits, features, process steps, why-choose-us items, industries, overview
paragraphs/highlights) is deleted and re-inserted on every run, so running
this script repeatedly never creates duplicate rows. This mirrors the
convention already used by `seed_data.py`'s `seed_services()` function.

Out of scope (untouched by this script): the `gst-services`,
`income-tax-advisory` and `tds-compliance` Service rows - those were already
seeded by `seed_data.py` and a future phase will migrate their page content.

`accounting-bookkeeping` is also already a Service row seeded by
`seed_data.py`, including its FAQs (that page's FAQSection.jsx fetches FAQs
from the API rather than hardcoding them locally, so those FAQ rows are
already the migrated source of truth) - this script updates its flat
hero/overview/etc. columns and child collections *other than* FAQs, and
deliberately leaves its existing service_faqs rows untouched.
"""
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app import create_app
from app.extensions import db
from app.models import (
    Service,
    ServiceBenefit,
    ServiceFaq,
    ServiceFeature,
    ServiceIndustry,
    ServiceOverviewHighlight,
    ServiceOverviewParagraph,
    ServiceProcessStep,
    ServiceWhyChooseUs,
)

# Duplicated from seed_data.py rather than imported: seed_data.py is a
# standalone script meant to be run directly, and importing it would pull in
# its argon2 dependency and its whole module-level SEED constant block for no
# benefit - this helper is a few lines and safe to copy.


def get_or_create(model, lookup, defaults=None):
    instance = model.query.filter_by(**lookup).first()
    if instance is None:
        instance = model(**lookup, **(defaults or {}))
        db.session.add(instance)
        db.session.flush()
        return instance, True
    for key, value in (defaults or {}).items():
        setattr(instance, key, value)
    db.session.flush()
    return instance, False


# ---------------------------------------------------------------------------
# Source content, transcribed verbatim from each page's React source.
#
# category/sort_order notes:
#   - "corporate_specialised" sort_order follows the order these 6 services
#     (including business-advisory) appear in frontend/src/data/navigation.js's
#     "Corporate & Specialised Services" menu column.
#   - badge_label "Specialised" is copied from navigation.js's `badge` field
#     for the two items that carry it there (rera-registration and
#     land-laws-consultancy); the other services have no badge in navigation.js
#     so badge_label is left as None rather than invented.
#   - "our_services" sort_order continues the sequence already used by
#     seed_data.py for gst-services(0)/income-tax-advisory(1)/tds-compliance(2)
#     -accounting-bookkeeping was already seeded there at sort_order=3, which
#     also matches its position in navigation.js's "Our Services" column, so
#     that value is kept. audit-assurance is new and takes the next slot (4),
#     also matching its navigation.js position.
# ---------------------------------------------------------------------------

SERVICE_DEFS = [
    {
        "slug": "company-llp-registration",
        "name": "Company & LLP Registration (ROC)",
        "category": "corporate_specialised",
        "badge_label": None,
        "sort_order": 0,
        "hero": {
            "breadcrumb_label": "Company & LLP Registration",
            "title_prefix": "Company & LLP",
            "title_highlight": "Registration",
            "description": (
                "We provide end-to-end assistance with Private Limited Company, LLP and OPC incorporation, "
                "along with ROC annual filings and ongoing corporate compliance, helping you start and run "
                "your business on a solid legal foundation from day one."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "A Reliable Partner for",
            "heading_highlight": "Company & LLP Registration",
            "paragraphs": [
                "Choosing the right business structure and getting it registered correctly is one of the most important decisions a founder makes. Whether it's a Private Limited Company, an LLP or an OPC, the entity you choose shapes your compliance obligations, tax position and ability to raise funds for years to come.",
                "We guide you through incorporation end to end, then keep you compliant with the Registrar of Companies year after year -so directors and partners can focus on running the business, not chasing paperwork.",
            ],
            "highlights": [
                "Private Limited Company Incorporation",
                "LLP & OPC Registration",
                "ROC Annual Compliance",
                "Director KYC & DIN Support",
                "Personalised Guidance",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Company & LLP",
            "heading_highlight": "Registration Services",
            "intro": "Everything your business needs to incorporate correctly and stay compliant with the ROC, under one roof.",
            "items": [
                {"icon": "FiFileText", "title": "Company Incorporation", "description": "End-to-end Private Limited Company registration, done right the first time."},
                {"icon": "FiUsers", "title": "LLP Registration", "description": "Limited Liability Partnership formation with complete documentation support."},
                {"icon": "FiUser", "title": "OPC Registration", "description": "One Person Company incorporation for solo founders and promoters."},
                {"icon": "FiClipboard", "title": "ROC Annual Filing", "description": "Annual returns and financial statements filed accurately with the ROC."},
                {"icon": "FiUserCheck", "title": "Director KYC", "description": "Timely DIR-3 KYC filing to keep director records active and compliant."},
                {"icon": "FiKey", "title": "DIN & DSC Assistance", "description": "Director Identification Number and Digital Signature Certificate support."},
                {"icon": "FiShield", "title": "Corporate Compliance", "description": "Ongoing statutory compliance so your company never falls behind."},
                {"icon": "FiCompass", "title": "Business Registration Advisory", "description": "Guidance on choosing the right structure for your business goals."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after incorporation.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding your business and the right structure for it."},
                {"icon": "FiSearch", "title": "Requirement Analysis", "description": "Assessing promoters, capital and structure requirements in detail."},
                {"icon": "FiClipboard", "title": "Document Collection", "description": "Gathering identity, address and registration documents needed."},
                {"icon": "FiEye", "title": "Verification", "description": "A careful check of every document before filing begins."},
                {"icon": "FiFileText", "title": "Application / Registration", "description": "Filing the incorporation application with the Registrar of Companies."},
                {"icon": "FiCheckCircle", "title": "Compliance Review", "description": "Confirming every post-incorporation requirement is in order."},
                {"icon": "FiAward", "title": "Approval / Completion", "description": "Certificate of incorporation and registration documents delivered."},
                {"icon": "FiHeadphones", "title": "Ongoing Support", "description": "Continued ROC compliance support long after registration."},
            ],
        },
        "why_choose_us": {
            "intro": "We handle registration and compliance with the same care, from your first filing to every one after it.",
            "image_alt": "Chartered accountants assisting with company and LLP registration",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team well versed in company and LLP law."},
                {"icon": "FiLayers", "title": "End-to-End Assistance", "description": "From structure selection to ROC filing, fully managed."},
                {"icon": "FiShield", "title": "Regulatory Expertise", "description": "Filings that meet every Companies Act requirement."},
                {"icon": "FiFileText", "title": "Accurate Documentation", "description": "Paperwork prepared correctly the first time."},
                {"icon": "FiClock", "title": "Timely Service Delivery", "description": "Registrations and filings completed without delay."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear updates at every stage of the process."},
                {"icon": "FiLock", "title": "Confidential Handling", "description": "Your business information kept strictly confidential."},
                {"icon": "FiHeadphones", "title": "Dedicated Client Support", "description": "A point of contact who knows your business."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of Getting",
            "heading_highlight": "Registration Right",
            "intro": "A properly registered and compliant entity gives your business credibility, protection and room to grow.",
            "items": [
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
        "industries": {
            "intro": "We register and support entities across every stage of business, from first-time founders to established groups.",
            "items": [
                {"icon": "FiZap", "label": "Startups", "blurb": "Fast, founder-friendly incorporation."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Right-sized structures as you scale."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Full incorporation and ROC support."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Partnership-style flexibility, registered right."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Guidance on converting or registering afresh."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Practice-friendly entity structures."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "Structures suited to capital-intensive operations."},
                {"icon": "FiHeadphones", "label": "Service Businesses", "blurb": "Lean structures for service-led teams."},
                {"icon": "FiCompass", "label": "Real Estate Developers", "blurb": "Entities aligned with project requirements."},
                {"icon": "FiHeart", "label": "Trusts & NGOs", "blurb": "Advisory on the right structure for your mission."},
            ],
        },
        "faqs": [
            {"question": "Which is better -Private Limited Company or LLP?", "answer": "It depends on your funding plans, ownership structure and compliance appetite. Private Limited Companies suit businesses planning to raise equity funding, while LLPs suit smaller, partner-run businesses wanting lower compliance. We help you choose based on your specific goals."},
            {"question": "How long does company incorporation take?", "answer": "Once documents are in order, incorporation typically takes 7-15 working days, depending on name approval and Registrar processing times. We keep the process moving and flag delays early."},
            {"question": "What is ROC annual filing?", "answer": "Every registered company and LLP must file annual returns and financial statements with the Registrar of Companies each year. Missing these filings attracts penalties, so we track and manage the calendar for you."},
            {"question": "Do I need a DIN and DSC to register a company?", "answer": "Yes. Every proposed director needs a Director Identification Number and a Digital Signature Certificate to sign incorporation documents electronically. We handle both as part of the registration process."},
            {"question": "Can an LLP be converted into a Private Limited Company?", "answer": "Yes, an LLP can be converted into a Private Limited Company as the business grows, subject to certain conditions and ROC procedures. We guide you through the conversion end to end."},
            {"question": "What happens if ROC compliance is missed?", "answer": "Missed filings attract daily penalties and can eventually lead to the company or LLP being marked as non-compliant or struck off. We help you catch up on pending filings and stay current going forward."},
            {"question": "Do you assist with post-incorporation compliance?", "answer": "Yes. Beyond registration, we manage ongoing ROC filings, director KYC, statutory registers and other corporate compliance requirements so nothing is missed after day one."},
        ],
        "cta": {
            "heading": "Need Assistance with Company Registration?",
            "description": "Get your Private Limited Company, LLP or OPC registered correctly and stay compliant with the Registrar of Companies year after year. Our experienced team manages the entire process, so you can focus on building your business.",
        },
    },
    {
        "slug": "rera-registration",
        "name": "RERA Registration & Compliance",
        "category": "corporate_specialised",
        "badge_label": "Specialised",
        "sort_order": 1,
        "hero": {
            "breadcrumb_label": "RERA Registration & Compliance",
            "title_prefix": "RERA Registration &",
            "title_highlight": "Compliance",
            "description": (
                "We provide professional assistance for builders, developers and real estate projects with "
                "RERA registration and ongoing regulatory compliance, helping projects stay transparent, "
                "credible and fully aligned with applicable real estate laws."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "Dependable RERA Support for",
            "heading_highlight": "Builders & Developers",
            "paragraphs": [
                "The Real Estate (Regulation and Development) Act exists to bring transparency and accountability to real estate transactions -but the registration and ongoing filing requirements can be detailed and time-sensitive for builders and developers.",
                "We manage project and builder registration, documentation and periodic compliance filings so your projects stay on the right side of RERA at every stage, from launch to completion and handover.",
            ],
            "highlights": [
                "Project Registration",
                "Builder Registration",
                "Quarterly Compliance Filing",
                "Regulatory Advisory",
                "Renewal Support",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our RERA Registration &",
            "heading_highlight": "Compliance Services",
            "intro": "Everything a real estate project needs to register, file and stay compliant with RERA, under one roof.",
            "items": [
                {"icon": "FiHome", "title": "Project Registration", "description": "End-to-end RERA registration for new real estate projects."},
                {"icon": "FiUser", "title": "Builder Registration", "description": "Registration support for builders and real estate agents."},
                {"icon": "FiFileText", "title": "Documentation", "description": "Preparing the documents and disclosures RERA registration requires."},
                {"icon": "FiClipboard", "title": "Compliance Filing", "description": "Periodic project updates and compliance filings kept on schedule."},
                {"icon": "FiCompass", "title": "Regulatory Advisory", "description": "Guidance on applicable RERA rules for your specific project."},
                {"icon": "FiRefreshCw", "title": "Renewal Support", "description": "Timely renewal of project registration before it lapses."},
                {"icon": "FiArchive", "title": "Record Maintenance", "description": "Project records maintained in the form RERA expects."},
                {"icon": "FiRepeat", "title": "Ongoing Compliance", "description": "Continuous monitoring so no filing deadline is missed."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after registration.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding your project and its registration requirements."},
                {"icon": "FiSearch", "title": "Requirement Analysis", "description": "Reviewing project size, timelines and applicable RERA obligations."},
                {"icon": "FiClipboard", "title": "Document Collection", "description": "Gathering project, land and promoter documentation."},
                {"icon": "FiEye", "title": "Verification", "description": "A careful review of every disclosure before filing."},
                {"icon": "FiFileText", "title": "Application / Registration", "description": "Filing the project or builder registration application."},
                {"icon": "FiCheckCircle", "title": "Compliance Review", "description": "Confirming ongoing filing and disclosure requirements are met."},
                {"icon": "FiAward", "title": "Approval / Completion", "description": "Registration certificate obtained and shared with you."},
                {"icon": "FiHeadphones", "title": "Ongoing Support", "description": "Continued compliance support through the project lifecycle."},
            ],
        },
        "why_choose_us": {
            "intro": "We bring the same discipline to every RERA filing, from first registration to project completion.",
            "image_alt": "Real estate compliance review meeting for a RERA registered project",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team familiar with real estate regulatory requirements."},
                {"icon": "FiLayers", "title": "End-to-End Assistance", "description": "From registration to renewal, fully managed for you."},
                {"icon": "FiShield", "title": "Regulatory Expertise", "description": "Filings that align with the latest RERA requirements."},
                {"icon": "FiFileText", "title": "Accurate Documentation", "description": "Disclosures and records prepared correctly."},
                {"icon": "FiClock", "title": "Timely Service Delivery", "description": "Registrations and renewals completed on schedule."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear visibility into filing status at every stage."},
                {"icon": "FiLock", "title": "Confidential Handling", "description": "Project and financial information kept confidential."},
                {"icon": "FiHeadphones", "title": "Dedicated Client Support", "description": "A point of contact who understands your project."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of Staying",
            "heading_highlight": "RERA Compliant",
            "intro": "RERA compliance protects your project's credibility and keeps buyer trust intact.",
            "items": [
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
        "industries": {
            "intro": "We support real estate stakeholders of every size, from independent builders to large development groups.",
            "items": [
                {"icon": "FiHome", "label": "Real Estate Developers", "blurb": "Project registration handled end to end."},
                {"icon": "FiZap", "label": "Startups", "blurb": "First-time developer registration support."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Right-sized compliance for smaller projects."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Corporate developer registrations managed."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "LLP-structured project entities supported."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Partnership-run projects registered correctly."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Real estate agent registration support."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "Compliance for industrial real estate projects."},
                {"icon": "FiHeadphones", "label": "Service Businesses", "blurb": "Commercial project compliance handled."},
                {"icon": "FiHeart", "label": "Trusts & NGOs", "blurb": "Guidance for trust-owned developments."},
            ],
        },
        "faqs": [
            {"question": "Which real estate projects require RERA registration?", "answer": "Most residential and commercial projects above the prescribed plot size or unit threshold must be registered with RERA before advertising, marketing, booking or selling any unit. We assess whether your specific project falls within scope."},
            {"question": "How long does RERA project registration take?", "answer": "Once the application and documents are complete, most state RERA authorities process registration within 30 days, absent any deficiency. We prepare the filing to minimise back-and-forth queries."},
            {"question": "What ongoing compliance does RERA require?", "answer": "Registered projects must file quarterly progress updates, maintain a separate project bank account, and keep disclosures on the RERA portal current until the project is completed and handed over."},
            {"question": "Can RERA registration be renewed?", "answer": "Yes. If a project isn't completed within the registered timeline, builders can apply for an extension or renewal, subject to the applicable state RERA rules. We manage the renewal filing on your behalf."},
            {"question": "Do individual real estate agents need RERA registration?", "answer": "Yes. Real estate agents facilitating the sale or purchase of RERA-registered projects are generally required to register separately as agents under RERA."},
            {"question": "What happens if a project isn't RERA registered?", "answer": "Selling or advertising an unregistered project that requires RERA registration can attract significant penalties and legal action. We help you register before any marketing or booking activity begins."},
            {"question": "Can you help with buyer complaints or RERA disputes?", "answer": "Yes. We assist in preparing documentation and compliance records that support your position in the event of a buyer complaint or RERA authority inquiry."},
        ],
        "cta": {
            "heading": "Need Professional RERA Registration Assistance?",
            "description": "Keep your real estate project transparent, credible and fully compliant with RERA. Our experienced team manages registration, documentation and ongoing filings, so you can focus on delivering your project.",
        },
    },
    {
        "slug": "land-laws-consultancy",
        "name": "Land Laws Consultancy (UPZLAR)",
        "category": "corporate_specialised",
        "badge_label": "Specialised",
        "sort_order": 2,
        "hero": {
            "breadcrumb_label": "Land Laws Consultancy (UPZLAR)",
            "title_prefix": "Land Laws",
            "title_highlight": "Consultancy",
            "description": (
                "We provide specialised consultancy related to the Uttar Pradesh Zamindari Abolition and Land "
                "Reforms Act (UPZLAR), guiding individuals, businesses and developers through applicable land "
                "law matters, documentation and government procedures with clarity and confidence."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "Specialised Guidance on",
            "heading_highlight": "Land Law Matters",
            "paragraphs": [
                "Land law in India, and particularly matters governed by the Zamindari Abolition and Land Reforms Act, involves layered regulations, historical records and government procedures that are easy to get wrong without specialised guidance.",
                "We help clients navigate land classification, conversion, documentation and compliance requirements under applicable land laws, so property matters are handled correctly from the outset and stand up to scrutiny later.",
            ],
            "highlights": [
                "Land Law Consultation",
                "Property Documentation",
                "Land Records Advisory",
                "Government Procedure Support",
                "Personalised Guidance",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Land Laws",
            "heading_highlight": "Consultancy Services",
            "intro": "Everything you need to understand, document and comply with applicable land law requirements, under one roof.",
            "items": [
                {"icon": "FiCompass", "title": "Land Law Consultation", "description": "Expert guidance on applicable land law provisions for your matter."},
                {"icon": "FiFileText", "title": "Property Documentation", "description": "Preparation and review of documentation related to land holdings."},
                {"icon": "FiBookOpen", "title": "Legal Guidance", "description": "Clear explanation of your rights and obligations under land law."},
                {"icon": "FiShield", "title": "Regulatory Compliance", "description": "Ensuring land-related matters meet applicable regulatory requirements."},
                {"icon": "FiArchive", "title": "Land Records Advisory", "description": "Guidance on verifying and updating land revenue records."},
                {"icon": "FiHome", "title": "Government Procedures", "description": "Support navigating applications and processes with land authorities."},
                {"icon": "FiClipboard", "title": "Documentation Support", "description": "Assembling the paperwork government procedures require."},
                {"icon": "FiUsers", "title": "Advisory Services", "description": "Ongoing advisory for individuals, businesses and developers."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support through every procedure.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding your land matter and its specific requirements."},
                {"icon": "FiSearch", "title": "Requirement Analysis", "description": "Reviewing land classification, records and applicable provisions."},
                {"icon": "FiClipboard", "title": "Document Collection", "description": "Gathering land records, title documents and supporting papers."},
                {"icon": "FiEye", "title": "Verification", "description": "Careful review of records and documentation for accuracy."},
                {"icon": "FiFileText", "title": "Application / Registration", "description": "Preparing and filing applications with the relevant authority."},
                {"icon": "FiCheckCircle", "title": "Compliance Review", "description": "Confirming the matter meets every applicable requirement."},
                {"icon": "FiAward", "title": "Approval / Completion", "description": "Following the matter through to resolution or approval."},
                {"icon": "FiHeadphones", "title": "Ongoing Support", "description": "Continued advisory for any follow-up land matters."},
            ],
        },
        "why_choose_us": {
            "intro": "We bring specialised, region-specific land law expertise to every consultation we take on.",
            "image_alt": "Land records and property documentation review for a land law consultation",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team familiar with land law and property matters."},
                {"icon": "FiLayers", "title": "End-to-End Assistance", "description": "From consultation to documentation, fully managed."},
                {"icon": "FiShield", "title": "Regulatory Expertise", "description": "Guidance grounded in the applicable land law provisions."},
                {"icon": "FiFileText", "title": "Accurate Documentation", "description": "Paperwork prepared carefully and correctly."},
                {"icon": "FiClock", "title": "Timely Service Delivery", "description": "Matters progressed without unnecessary delay."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear updates on where your matter stands."},
                {"icon": "FiLock", "title": "Confidential Handling", "description": "Property and personal details kept confidential."},
                {"icon": "FiHeadphones", "title": "Dedicated Client Support", "description": "A point of contact who understands your matter."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of Expert",
            "heading_highlight": "Land Law Guidance",
            "intro": "Getting land matters right the first time avoids costly disputes and delays later.",
            "items": [
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
        "industries": {
            "intro": "We advise individuals, businesses and developers on land matters across a range of use cases.",
            "items": [
                {"icon": "FiHome", "label": "Real Estate Developers", "blurb": "Land classification and title guidance."},
                {"icon": "FiZap", "label": "Startups", "blurb": "Land-related due diligence support."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Documentation for owned or leased land."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Corporate land holding matters advised on."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Land documentation for LLP-owned assets."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Guidance on jointly held land matters."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Personal property and land advisory."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "Land conversion and use guidance."},
                {"icon": "FiHeadphones", "label": "Service Businesses", "blurb": "Leasehold and premises documentation."},
                {"icon": "FiHeart", "label": "Trusts & NGOs", "blurb": "Land matters for trust-held property."},
            ],
        },
        "faqs": [
            {"question": "What is the Zamindari Abolition and Land Reforms Act?", "answer": "It is state legislation enacted to abolish the zamindari system and reform land tenure, governing land classification, tenancy rights and revenue records in the applicable state. We advise on how its provisions apply to your specific land matter."},
            {"question": "Do I need to verify land records before purchasing property?", "answer": "Yes. Verifying land classification, revenue records and title history before purchase helps avoid disputes and ensures the land can be legally used for your intended purpose. We assist with this verification."},
            {"question": "Can agricultural land be converted for other use?", "answer": "In many cases, agricultural land can be converted for residential, commercial or industrial use through the prescribed government procedure, subject to state rules and eligibility. We guide you through the conversion process."},
            {"question": "What documents are typically required for land matters?", "answer": "Common documents include revenue records, sale deeds, mutation records, and identity proofs, though the exact list depends on the specific matter. We provide a tailored checklist once we understand your requirement."},
            {"question": "Can you help with disputed land records?", "answer": "Yes. We help clients understand discrepancies in land records, prepare documentation to support correction applications, and guide them through the applicable government procedure."},
            {"question": "How long do land law matters typically take to resolve?", "answer": "Timelines vary widely depending on the nature of the matter and the government authority involved, from a few weeks for straightforward applications to longer for matters requiring verification or dispute resolution."},
            {"question": "Do you provide ongoing advisory for land holdings?", "answer": "Yes. Beyond one-time consultations, we offer ongoing advisory support for businesses and individuals holding land assets that require periodic compliance or documentation updates."},
        ],
        "cta": {
            "heading": "Need Expert Land Law Consultancy?",
            "description": "Navigate land classification, documentation and government procedures with confidence. Our experienced team provides clear, practical guidance on land law matters so your property decisions are well informed and legally sound.",
        },
    },
    {
        "slug": "trust-ngo-registration",
        "name": "Trust, NGO & Society Registration",
        "category": "corporate_specialised",
        "badge_label": None,
        "sort_order": 3,
        "hero": {
            "breadcrumb_label": "Trust, NGO & Society Registration",
            "title_prefix": "Trust, NGO &",
            "title_highlight": "Society Registration",
            "description": (
                "We support the registration and ongoing regulatory compliance of trusts, NGOs and societies, "
                "helping founders and trustees set up a credible, legally sound organisation built to attract "
                "funding and serve its mission with confidence."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "Trusted Guidance for",
            "heading_highlight": "Trust, NGO & Society Registration",
            "paragraphs": [
                "Trusts, NGOs and societies operate under distinct legal frameworks, each with its own registration process, governing documents and ongoing compliance obligations. Getting the structure and paperwork right at the outset makes every filing, audit and funding application that follows far smoother.",
                "We help founders and trustees choose the right structure, prepare the governing documents, complete registration, and stay compliant year after year -so your organisation can focus on its mission with a credible legal foundation behind it.",
            ],
            "highlights": [
                "Trust Registration",
                "NGO & Society Registration",
                "Annual Compliance Filings",
                "Amendment Assistance",
                "Personalised Guidance",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Trust, NGO & Society",
            "heading_highlight": "Registration Services",
            "intro": "Everything your organisation needs to register, document and stay compliant, under one roof.",
            "items": [
                {"icon": "FiHeart", "title": "Trust Registration", "description": "End-to-end registration of public and private charitable trusts."},
                {"icon": "FiUsers", "title": "NGO Registration", "description": "Guidance and filing support for non-governmental organisations."},
                {"icon": "FiUserCheck", "title": "Society Registration", "description": "Registration under the Societies Registration Act, done correctly."},
                {"icon": "FiFileText", "title": "Documentation", "description": "Trust deeds, MOAs and bylaws drafted to match your objectives."},
                {"icon": "FiShield", "title": "Compliance Support", "description": "Ongoing regulatory compliance for registered organisations."},
                {"icon": "FiClipboard", "title": "Annual Filings", "description": "Statutory returns and filings completed on schedule every year."},
                {"icon": "FiEdit3", "title": "Amendment Assistance", "description": "Updating governing documents as your organisation evolves."},
                {"icon": "FiCompass", "title": "Regulatory Advisory", "description": "Guidance on applicable laws for your specific organisation type."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after registration.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding your mission and the right structure for it."},
                {"icon": "FiSearch", "title": "Requirement Analysis", "description": "Assessing objectives, governance and applicable registration route."},
                {"icon": "FiClipboard", "title": "Document Collection", "description": "Gathering trustee, member and address documentation."},
                {"icon": "FiEye", "title": "Verification", "description": "A careful review of governing documents before filing."},
                {"icon": "FiFileText", "title": "Application / Registration", "description": "Filing the registration application with the relevant authority."},
                {"icon": "FiCheckCircle", "title": "Compliance Review", "description": "Confirming post-registration obligations are understood and met."},
                {"icon": "FiAward", "title": "Approval / Completion", "description": "Registration certificate obtained and shared with you."},
                {"icon": "FiHeadphones", "title": "Ongoing Support", "description": "Continued compliance support as your organisation grows."},
            ],
        },
        "why_choose_us": {
            "intro": "We understand the unique governance and compliance needs of mission-driven organisations.",
            "image_alt": "Trustees and advisors reviewing NGO and society registration documents",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team familiar with trust and NGO regulations."},
                {"icon": "FiLayers", "title": "End-to-End Assistance", "description": "From structure selection to annual filings, fully managed."},
                {"icon": "FiShield", "title": "Regulatory Expertise", "description": "Registrations that meet every applicable legal requirement."},
                {"icon": "FiFileText", "title": "Accurate Documentation", "description": "Trust deeds and bylaws drafted with care."},
                {"icon": "FiClock", "title": "Timely Service Delivery", "description": "Registrations completed without unnecessary delay."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear updates throughout the registration process."},
                {"icon": "FiLock", "title": "Confidential Handling", "description": "Trustee and organisational details kept confidential."},
                {"icon": "FiHeadphones", "title": "Dedicated Client Support", "description": "A point of contact who understands your mission."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of Proper",
            "heading_highlight": "Registration & Compliance",
            "intro": "A well-registered, compliant organisation is better positioned to raise funds and earn public trust.",
            "items": [
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
        "industries": {
            "intro": "We support mission-driven organisations and the businesses that partner with them.",
            "items": [
                {"icon": "FiHeart", "label": "Trusts & NGOs", "blurb": "Registration and compliance handled end to end."},
                {"icon": "FiZap", "label": "Startups", "blurb": "Foundation and CSR-arm registration support."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Guidance on CSR and giving structures."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Corporate foundation setup and compliance."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Advisory on associated charitable structures."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Guidance on related philanthropic entities."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Personal trust and estate planning support."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "CSR trust registration for industrial groups."},
                {"icon": "FiHome", "label": "Real Estate Developers", "blurb": "Trust structures for property-linked giving."},
                {"icon": "FiCompass", "label": "Service Businesses", "blurb": "Advisory on setting up a giving arm."},
            ],
        },
        "faqs": [
            {"question": "What is the difference between a trust, NGO and society?", "answer": "A trust is formed through a trust deed to manage assets for a charitable purpose, a society is formed by a group of members under the Societies Registration Act, and NGO is a broader term covering non-profit organisations that may be structured as a trust, society or Section 8 company. We help you choose the right structure for your goals."},
            {"question": "Which structure is best for receiving foreign donations?", "answer": "Receiving foreign contributions requires FCRA registration regardless of structure, though eligibility and process can differ. We advise on the right structure and guide you through the FCRA registration process where applicable."},
            {"question": "What documents are needed to register a trust or society?", "answer": "Typically you need identity and address proof of trustees or members, a trust deed or memorandum of association, and proof of the registered address. We prepare a checklist specific to your organisation and jurisdiction."},
            {"question": "Do trusts and societies need to file annual returns?", "answer": "Yes. Depending on the structure and applicable state law, annual returns, financial statements and, in many cases, income tax filings are required to maintain good standing and any tax exemption status."},
            {"question": "Can the objectives of a trust or society be changed later?", "answer": "Yes, governing documents can generally be amended through a formal procedure, though the process and approvals required vary by structure and state. We assist with drafting and filing the amendment."},
            {"question": "How do I get 12A and 80G registration for tax exemption?", "answer": "12A registration exempts the organisation's income from tax, while 80G allows donors to claim a deduction for their contributions. Both require separate applications to the Income Tax Department, which we help you prepare and file."},
            {"question": "How long does registration typically take?", "answer": "Timelines vary by structure and state, but most trust, NGO and society registrations are completed within a few weeks once documentation is in order. We keep the process moving and flag any delays early."},
        ],
        "cta": {
            "heading": "Need Help Registering Your Trust or NGO?",
            "description": "Set up your trust, NGO or society on a solid legal foundation and stay compliant year after year. Our experienced team manages registration, documentation and ongoing filings, so you can focus on your mission.",
        },
    },
    {
        "slug": "digital-signature-certificate",
        "name": "Digital Signature Certificate (DSC)",
        "category": "corporate_specialised",
        "badge_label": None,
        "sort_order": 4,
        "hero": {
            "breadcrumb_label": "Digital Signature Certificate (DSC)",
            "title_prefix": "Digital Signature",
            "title_highlight": "Certificate",
            "description": (
                "We provide fast, reliable assistance with Digital Signature Certificate applications and "
                "renewals for individuals, professionals and companies, helping you sign filings, contracts "
                "and government submissions securely and without delay."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "Fast, Reliable Support for",
            "heading_highlight": "Digital Signature Certificates",
            "paragraphs": [
                "A Digital Signature Certificate is now a basic requirement for directors, professionals and businesses -needed to file ROC forms, income tax returns, GST filings and countless other government submissions securely online.",
                "We manage the entire application and renewal process, including identity verification, document preparation and token setup, so you're never stuck waiting on a DSC when a filing deadline is approaching.",
            ],
            "highlights": [
                "New DSC Application",
                "DSC Renewal",
                "Class 3 & Director DSC",
                "Installation & Token Support",
                "Personalised Guidance",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Digital Signature",
            "heading_highlight": "Certificate Services",
            "intro": "Everything you need to obtain, renew and use your Digital Signature Certificate, under one roof.",
            "items": [
                {"icon": "FiFilePlus", "title": "New DSC Application", "description": "Fresh DSC applications processed quickly for individuals and entities."},
                {"icon": "FiRefreshCw", "title": "DSC Renewal", "description": "Timely renewal so your certificate never lapses mid-filing."},
                {"icon": "FiShield", "title": "Class 3 DSC", "description": "Class 3 certificates for e-tendering, e-filing and secure transactions."},
                {"icon": "FiUserCheck", "title": "Director DSC", "description": "DSC issuance for company directors and authorised signatories."},
                {"icon": "FiBriefcase", "title": "Professional DSC", "description": "Certificates tailored for CAs, CS and other professionals."},
                {"icon": "FiTool", "title": "Installation Support", "description": "Guided installation on your system so signing works first time."},
                {"icon": "FiCpu", "title": "Token Configuration", "description": "USB token setup and driver configuration handled for you."},
                {"icon": "FiHeadphones", "title": "Technical Assistance", "description": "Ongoing support for any signing or token issues that arise."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after issuance.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding who needs the DSC and for what purpose."},
                {"icon": "FiSearch", "title": "Requirement Analysis", "description": "Confirming the right class and validity period for your need."},
                {"icon": "FiClipboard", "title": "Document Collection", "description": "Gathering identity and address proof for verification."},
                {"icon": "FiEye", "title": "Verification", "description": "Video or in-person verification as required by the certifying authority."},
                {"icon": "FiFileText", "title": "Application / Registration", "description": "Submitting the application to the certifying authority."},
                {"icon": "FiCheckCircle", "title": "Compliance Review", "description": "Confirming the certificate meets your filing requirements."},
                {"icon": "FiAward", "title": "Approval / Completion", "description": "DSC issued and token configured for immediate use."},
                {"icon": "FiHeadphones", "title": "Ongoing Support", "description": "Continued help with installation, renewal and troubleshooting."},
            ],
        },
        "why_choose_us": {
            "intro": "We keep DSC issuance quick and painless, so you're never stuck at a filing deadline.",
            "image_alt": "Professional completing a Digital Signature Certificate application process",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team that handles DSC applications daily."},
                {"icon": "FiLayers", "title": "End-to-End Assistance", "description": "From application to installation, fully managed."},
                {"icon": "FiShield", "title": "Regulatory Expertise", "description": "Applications processed per certifying authority norms."},
                {"icon": "FiFileText", "title": "Accurate Documentation", "description": "Paperwork prepared correctly to avoid rejection."},
                {"icon": "FiClock", "title": "Timely Service Delivery", "description": "Certificates issued quickly, ahead of your deadline."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear updates on application and verification status."},
                {"icon": "FiLock", "title": "Confidential Handling", "description": "Identity documents and tokens handled securely."},
                {"icon": "FiHeadphones", "title": "Dedicated Client Support", "description": "A point of contact for setup and renewal questions."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of a Valid",
            "heading_highlight": "Digital Signature",
            "intro": "A valid, correctly configured DSC keeps your filings moving without last-minute scrambles.",
            "items": [
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
        "industries": {
            "intro": "We issue and renew DSCs for individuals and organisations across every sector.",
            "items": [
                {"icon": "FiZap", "label": "Startups", "blurb": "Director DSC issued from day one."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Quick turnaround for growing teams."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "DSCs for every authorised signatory."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Partner DSC issuance and renewal."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Signing certificates for authorised partners."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "CA, CS and consultant DSC support."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "DSCs for e-tendering and filings."},
                {"icon": "FiHeadphones", "label": "Service Businesses", "blurb": "Fast issuance for signing contracts."},
                {"icon": "FiHome", "label": "Real Estate Developers", "blurb": "DSCs for RERA and regulatory filings."},
                {"icon": "FiHeart", "label": "Trusts & NGOs", "blurb": "Trustee DSC issuance handled smoothly."},
            ],
        },
        "faqs": [
            {"question": "What is a Digital Signature Certificate used for?", "answer": "A DSC is used to sign documents electronically for ROC filings, income tax returns, GST filings, e-tendering and other government submissions, giving the document the same legal validity as a handwritten signature."},
            {"question": "What is the difference between Class 3 and other DSC classes?", "answer": "Class 3 DSCs offer the highest level of assurance and are required for e-tendering, e-auctions and most regulatory filings today, having largely replaced the older Class 2 category."},
            {"question": "How long is a DSC valid for?", "answer": "DSCs are typically issued with a validity of one to three years. We track your certificate's expiry and reach out ahead of time so renewal happens before it lapses."},
            {"question": "What documents are required for a DSC application?", "answer": "Generally you need identity proof, address proof, a photograph and, for organisational DSCs, authorisation documents from the company or LLP. We confirm the exact list based on your specific requirement."},
            {"question": "Is video verification mandatory for DSC issuance?", "answer": "Most certifying authorities now require a brief video verification as part of the identity confirmation process. We guide you through this step so it goes smoothly on the first attempt."},
            {"question": "Can you help if my DSC token isn't working?", "answer": "Yes. We provide technical assistance for token driver installation, browser configuration and signing issues, so your DSC works reliably when you need to file."},
            {"question": "Do directors of multiple companies need separate DSCs?", "answer": "No, a single DSC issued to an individual can generally be used to sign filings across all companies and LLPs where they are an authorised signatory, provided it is properly registered on each portal."},
        ],
        "cta": {
            "heading": "Need a Digital Signature Certificate?",
            "description": "Get a new DSC issued or your existing certificate renewed quickly, with full installation and token support included. Our experienced team keeps your filings moving without delay.",
        },
    },
    {
        "slug": "business-advisory",
        "name": "Business Advisory & Company Formation",
        # navigation.js lists this as the 6th item under "Corporate &
        # Specialised Services" (not "Our Services") - category/sort_order
        # corrected to match its actual live nav position.
        "category": "corporate_specialised",
        "badge_label": None,
        "sort_order": 5,
        "hero": {
            "breadcrumb_label": "Business Advisory & Company Formation",
            "title_prefix": "Business Advisory &",
            "title_highlight": "Company Formation",
            "description": (
                "We provide end-to-end guidance for startups and new businesses, from selecting the right "
                "business structure to registration, business planning and ongoing compliance, helping "
                "founders build on a solid foundation from day one."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "Trusted Guidance for",
            "heading_highlight": "Startups & Growing Businesses",
            "paragraphs": [
                "Every business decision -from the legal structure you choose to how you plan for growth -has consequences that compound over time. Getting expert advice early saves founders from costly restructuring and compliance headaches later.",
                "We work with founders from the very first conversation, helping you choose the right structure, get registered, plan for growth and stay compliant as the business scales -so you can focus on building, not untangling avoidable problems.",
            ],
            "highlights": [
                "Business Structure Advisory",
                "Startup & Company Registration",
                "Business Planning Support",
                "Regulatory Compliance",
                "Personalised Guidance",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Business Advisory &",
            "heading_highlight": "Company Formation Services",
            "intro": "Everything a founder needs to structure, register and grow a business, under one roof.",
            "items": [
                {"icon": "FiCompass", "title": "Business Structure Advisory", "description": "Guidance on choosing the right legal structure for your goals."},
                {"icon": "FiZap", "title": "Startup Registration", "description": "End-to-end registration support tailored for new businesses."},
                {"icon": "FiFileText", "title": "Company Formation", "description": "Private Limited Company incorporation, done correctly and quickly."},
                {"icon": "FiLayers", "title": "LLP Formation", "description": "Limited Liability Partnership registration for partner-run businesses."},
                {"icon": "FiTrendingUp", "title": "Business Planning Support", "description": "Practical input on financial planning and growth strategy."},
                {"icon": "FiShield", "title": "Regulatory Compliance", "description": "Keeping your business compliant as it registers and scales."},
                {"icon": "FiBarChart2", "title": "Growth Advisory", "description": "Ongoing guidance as your business moves into its next stage."},
                {"icon": "FiHeadphones", "title": "Ongoing Business Support", "description": "A dependable advisor available well beyond formation."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after formation.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding your business idea and long-term goals."},
                {"icon": "FiSearch", "title": "Requirement Analysis", "description": "Assessing the right structure, capital and compliance needs."},
                {"icon": "FiClipboard", "title": "Document Collection", "description": "Gathering promoter and registration documentation."},
                {"icon": "FiEye", "title": "Verification", "description": "A careful review of every document before filing."},
                {"icon": "FiFileText", "title": "Application / Registration", "description": "Filing the incorporation or registration application."},
                {"icon": "FiCheckCircle", "title": "Compliance Review", "description": "Confirming every post-formation requirement is in order."},
                {"icon": "FiAward", "title": "Approval / Completion", "description": "Registration completed and documents handed over."},
                {"icon": "FiHeadphones", "title": "Ongoing Support", "description": "Continued advisory as your business grows."},
            ],
        },
        "why_choose_us": {
            "intro": "We advise founders the way we'd want to be advised -clearly, practically, and with the long term in mind.",
            "image_alt": "Business advisors discussing company formation strategy with a founder",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team that has guided founders across many industries."},
                {"icon": "FiLayers", "title": "End-to-End Assistance", "description": "From structure selection to ongoing compliance, fully managed."},
                {"icon": "FiShield", "title": "Regulatory Expertise", "description": "Advice grounded in current company and tax law."},
                {"icon": "FiFileText", "title": "Accurate Documentation", "description": "Registration paperwork prepared correctly the first time."},
                {"icon": "FiClock", "title": "Timely Service Delivery", "description": "Formation completed quickly, so you can start operating."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear, jargon-free advice at every stage."},
                {"icon": "FiLock", "title": "Confidential Handling", "description": "Your business plans and data kept strictly confidential."},
                {"icon": "FiHeadphones", "title": "Dedicated Client Support", "description": "A point of contact who understands your business."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of Expert",
            "heading_highlight": "Business Advisory",
            "intro": "The right advice at formation stage saves founders time, money and avoidable compliance risk later.",
            "items": [
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
        "industries": {
            "intro": "We advise founders and growing businesses across every stage and sector.",
            "items": [
                {"icon": "FiZap", "label": "Startups", "blurb": "Structure and registration guidance from day one."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Right-sized advisory as the business scales."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Formation and governance support."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Partnership-structured business formation."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Advisory on formalising and growing the firm."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Practice formation and structuring advice."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "Formation guidance for capital-intensive setups."},
                {"icon": "FiHeadphones", "label": "Service Businesses", "blurb": "Lean structures for service-led founders."},
                {"icon": "FiHome", "label": "Real Estate Developers", "blurb": "Entity structuring for project-based businesses."},
                {"icon": "FiHeart", "label": "Trusts & NGOs", "blurb": "Advisory on mission-aligned structures."},
            ],
        },
        "faqs": [
            {"question": "What business structure should I choose for a new startup?", "answer": "It depends on your funding plans, number of founders, and risk appetite -Private Limited Companies suit businesses planning to raise equity, while LLPs and proprietorships suit smaller, founder-run setups. We assess your specific situation before recommending a structure."},
            {"question": "How long does company or LLP formation take?", "answer": "Once documents are ready, formation typically takes 7-15 working days depending on name approval and government processing times. We keep the process moving and flag any delays early."},
            {"question": "Do you help with business planning, not just registration?", "answer": "Yes. Beyond formation, we advise on financial planning, budgeting and growth strategy, so the business is set up to scale, not just to exist on paper."},
            {"question": "Can I convert my proprietorship into a Private Limited Company later?", "answer": "Yes. Many businesses start as a proprietorship or partnership and convert into a Private Limited Company as they grow, subject to certain conditions. We guide you through the conversion when the time is right."},
            {"question": "What ongoing compliance does a new company need?", "answer": "New companies must maintain statutory registers, file annual returns with the ROC, handle director KYC, and meet applicable tax filing deadlines. We manage this compliance calendar so nothing is missed."},
            {"question": "Do you advise on investor readiness?", "answer": "Yes. We help structure your company's cap table, agreements and financial records in a way that stands up to investor due diligence when you're ready to raise funding."},
            {"question": "Can you support the business after formation is complete?", "answer": "Yes. We stay on as an ongoing advisor for compliance, tax planning and growth-stage decisions, rather than disappearing once the registration certificate is issued."},
        ],
        "cta": {
            "heading": "Need Expert Business Advisory Services?",
            "description": "Choose the right business structure, register correctly, and get practical guidance as your business grows. Our experienced team supports founders from the very first conversation through every stage that follows.",
        },
    },
    {
        "slug": "accounting-bookkeeping",
        "name": "Accounting & Bookkeeping",
        "category": "our_services",
        "badge_label": None,
        "sort_order": 3,
        "hero": {
            "breadcrumb_label": "Accounting & Bookkeeping",
            "title_prefix": "Accounting &",
            "title_highlight": "Bookkeeping",
            "description": (
                "Professional bookkeeping and accounting services designed to maintain accurate financial "
                "records, prepare reliable financial statements, and provide businesses with a strong "
                "financial foundation for informed decision-making and long-term growth."
            ),
        },
        "overview": {
            "tagline": "Why It Matters",
            "heading_prefix": "Professional Accounting",
            "heading_highlight": "Solutions",
            "paragraphs": [
                "Accurate bookkeeping is the backbone of every successful business. Proper maintenance of financial records not only improves compliance but also brings complete transparency to how your business actually performs, transaction by transaction.",
                "Well-prepared financial statements help you make informed decisions, while timely accounting enables better budgeting, tax planning and sustainable growth. Our team ensures every transaction is recorded accurately and systematically, so your books are always ready when you need them.",
            ],
            "highlights": [
                "Bookkeeping & Ledger Maintenance",
                "Financial Statement Preparation",
                "Bank Reconciliation",
                "Expense Tracking & Reporting",
                "Personalised Guidance",
                "Transparent, Hassle-Free Process",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Accounting &",
            "heading_highlight": "Bookkeeping Services",
            "intro": "Everything your business needs to keep its books accurate, organized and ready for every decision, under one roof.",
            "items": [
                {"icon": "FiBookOpen", "title": "Bookkeeping & Ledger Maintenance", "description": "Day-to-day recording of transactions kept accurate, current and audit-ready."},
                {"icon": "FiFileText", "title": "Financial Statement Preparation", "description": "Profit & loss, balance sheet and cash flow statements prepared reliably."},
                {"icon": "FiLayers", "title": "General Ledger Management", "description": "A well-organized ledger that keeps every account accurate and reconciled."},
                {"icon": "FiRepeat", "title": "Accounts Payable & Receivable", "description": "Vendor payments and customer collections tracked and managed on time."},
                {"icon": "FiRefreshCw", "title": "Bank Reconciliation", "description": "Bank statements matched against your books to catch every discrepancy."},
                {"icon": "FiCalendar", "title": "Monthly & Quarterly Accounting", "description": "Periodic closing of books so you always know exactly where you stand."},
                {"icon": "FiPieChart", "title": "Expense Tracking & Reporting", "description": "Clear visibility into where money is spent, categorized and reported."},
                {"icon": "FiArchive", "title": "Financial Record Maintenance", "description": "Systematic storage and upkeep of records for compliance and easy retrieval."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after your books are handed over.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Understand Business Requirements", "description": "We learn how your business operates and what your books need to capture."},
                {"icon": "FiClipboard", "title": "Collect Financial Documents", "description": "Gathering invoices, receipts, bank statements and existing records."},
                {"icon": "FiSearch", "title": "Record & Organize Transactions", "description": "Every transaction entered accurately and categorized systematically."},
                {"icon": "FiFileText", "title": "Prepare Financial Statements", "description": "Building reliable P&L, balance sheet and cash flow reports."},
                {"icon": "FiEye", "title": "Review & Quality Check", "description": "A careful check for accuracy before anything is finalized."},
                {"icon": "FiSend", "title": "Submission", "description": "Reports delivered on schedule, with acknowledgement shared with you."},
                {"icon": "FiThumbsUp", "title": "Ongoing Support", "description": "Continued support for questions or follow-up after handover."},
            ],
        },
        "why_choose_us": {
            "intro": "We keep your books current all year round -not just in the days before a filing or a review.",
            "image_alt": "Accounting professionals supporting a bookkeeping client",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Accounting Professionals", "description": "A team that understands bookkeeping and financial reporting inside out."},
                {"icon": "FiCheckCircle", "title": "Accurate Financial Reporting", "description": "Reports you can rely on, prepared with precision every time."},
                {"icon": "FiClock", "title": "Timely Record Maintenance", "description": "Books kept current, so nothing piles up at closing time."},
                {"icon": "FiLock", "title": "Confidential Data Handling", "description": "Your financial information handled with strict confidentiality."},
                {"icon": "FiShield", "title": "Regulatory Compliance", "description": "Records maintained in line with applicable accounting standards."},
                {"icon": "FiHeadphones", "title": "Personalized Business Support", "description": "A dedicated point of contact who actually knows your business."},
                {"icon": "FiEye", "title": "Transparent Communication", "description": "Clear visibility into your books and what's happening with them."},
                {"icon": "FiTrendingUp", "title": "Reliable Financial Insights", "description": "Numbers you can act on, not just numbers on a page."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of Professional",
            "heading_highlight": "Bookkeeping",
            "intro": "Well-maintained books do more than satisfy compliance -they give you a clear, current picture of your business at every stage.",
            "items": [
                "Accurate financial records",
                "Better cash flow management",
                "Improved business decisions",
                "Reduced accounting errors",
                "Easy tax preparation",
                "Compliance with accounting standards",
                "Financial transparency",
                "Business growth support",
            ],
        },
        "industries": {
            "intro": "Bookkeeping needs look different across sectors -our experience spans them all.",
            "items": [
                {"icon": "FiZap", "label": "Startups", "blurb": "Clean books from day one."},
                {"icon": "FiHome", "label": "Small Businesses", "blurb": "Right-sized accounting support."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Organized records as you scale."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Shared finances, tracked clearly."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Statutory-ready financial statements."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Compliant, well-maintained ledgers."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Simple bookkeeping for practices."},
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "Cost and inventory tracked accurately."},
                {"icon": "FiShoppingCart", "label": "Trading Businesses", "blurb": "Purchases and sales reconciled fast."},
                {"icon": "FiHeadphones", "label": "Service Providers", "blurb": "Billing and expenses kept in sync."},
            ],
        },
        # AccountingBookkeeping/components/FAQSection.jsx has no local FAQ
        # array - it fetches getServiceBySlug("accounting-bookkeeping") from
        # the API. Those FAQs are already the 8 rows seed_data.py's
        # seed_services() inserted for this slug, so this script must not
        # touch service_faqs for this service (None => skip FAQ handling
        # entirely below, instead of delete-then-readd with an empty list,
        # which would just wipe them).
        "faqs": None,
        "cta": {
            "heading": "Need Professional Accounting & Bookkeeping Assistance?",
            "description": "Keep your financial records accurate, organized and compliant with our expert accounting and bookkeeping services. Focus on growing your business while we manage your financial records with precision and professionalism.",
        },
    },
    {
        "slug": "audit-assurance",
        "name": "Audit & Assurance",
        "category": "our_services",
        "badge_label": None,
        "sort_order": 4,
        "hero": {
            "breadcrumb_label": "Audit & Assurance",
            "title_prefix": "Audit &",
            "title_highlight": "Assurance",
            "description": (
                "We provide comprehensive Audit & Assurance services, including statutory audits, tax audits, "
                "and internal audits, helping businesses maintain regulatory compliance, improve financial "
                "transparency, strengthen internal controls, and build stakeholder confidence through accurate "
                "and independent financial reporting."
            ),
        },
        "overview": {
            "tagline": "Overview",
            "heading_prefix": "Reliable Audit Services for",
            "heading_highlight": "Better Business Governance",
            "paragraphs": [
                "An independent audit is more than a regulatory formality -it's an objective check on how your business is actually performing. We examine your financial statements, processes and controls with the same rigour whether the requirement is statutory, tax-related or purely internal, so what you receive is an accurate, defensible picture of your organisation's financial health.",
                "Beyond compliance, a well-run audit surfaces risks early, strengthens internal controls, and improves operational efficiency -giving management and stakeholders the confidence to make better, well-informed decisions.",
            ],
            "highlights": [
                "Independent Financial Review",
                "Regulatory Compliance",
                "Risk Identification",
                "Stronger Internal Controls",
                "Improved Decision-Making",
                "Increased Stakeholder Confidence",
            ],
        },
        "features": {
            "tagline": "What We Offer",
            "heading_prefix": "Our Audit &",
            "heading_highlight": "Assurance Services",
            "intro": "Everything your business needs for independent, reliable and well-documented audits, under one roof.",
            "items": [
                {"icon": "FiFileText", "title": "Statutory Audit", "description": "Ensure compliance with applicable laws while providing an independent review of financial statements."},
                {"icon": "FiPercent", "title": "Tax Audit", "description": "Comprehensive tax audit services in accordance with Income Tax regulations."},
                {"icon": "FiShield", "title": "Internal Audit", "description": "Evaluate internal controls, operational efficiency, and risk management processes."},
                {"icon": "FiBarChart2", "title": "Financial Statement Audit", "description": "Independent examination of financial records to enhance credibility and transparency."},
                {"icon": "FiClipboard", "title": "Compliance Audit", "description": "Review compliance with applicable statutory and regulatory requirements."},
                {"icon": "FiAlertTriangle", "title": "Risk Assessment & Internal Controls", "description": "Identify business risks and recommend effective control mechanisms."},
                {"icon": "FiTrendingUp", "title": "Management Reporting", "description": "Detailed audit observations with practical recommendations for improvement."},
                {"icon": "FiHeadphones", "title": "Advisory Support", "description": "Professional guidance to strengthen governance, financial reporting, and business processes."},
            ],
        },
        "process": {
            "intro": "A structured, transparent path from your first conversation with us to support long after the audit report is delivered.",
            "steps": [
                {"icon": "FiPhoneCall", "title": "Initial Consultation", "description": "Understanding your business, industry and the audit requirement at hand."},
                {"icon": "FiUsers", "title": "Understanding Business Operations", "description": "Getting to know your processes, systems and financial structure."},
                {"icon": "FiAlertTriangle", "title": "Risk Assessment", "description": "Identifying areas of financial and operational risk to focus the audit."},
                {"icon": "FiClipboard", "title": "Audit Planning", "description": "Preparing a structured audit plan and timeline before work begins."},
                {"icon": "FiSearch", "title": "Field Work & Verification", "description": "Examining records, transactions and controls in detail, on the ground."},
                {"icon": "FiFileText", "title": "Reporting & Recommendations", "description": "Presenting findings clearly, with practical, actionable recommendations."},
                {"icon": "FiShield", "title": "Compliance Support", "description": "Helping you act on findings to meet every applicable requirement."},
                {"icon": "FiThumbsUp", "title": "Ongoing Advisory", "description": "Continued guidance long after the audit report is delivered."},
            ],
        },
        "why_choose_us": {
            "intro": "We approach every audit with the same independence and rigour, and we stay engaged well beyond the final report.",
            "image_alt": "Chartered accountants conducting a business audit meeting",
            "items": [
                {"icon": "FiUserCheck", "title": "Experienced Chartered Accountants", "description": "A team that brings deep audit and assurance expertise to every engagement."},
                {"icon": "FiEye", "title": "Independent & Objective Audits", "description": "Findings you can trust, free from bias or conflicts of interest."},
                {"icon": "FiShield", "title": "Regulatory Compliance Expertise", "description": "Audits conducted in line with the latest statutory requirements."},
                {"icon": "FiFileText", "title": "Transparent Reporting", "description": "Clear, well-documented reports that hold up to scrutiny."},
                {"icon": "FiTarget", "title": "Risk-Based Audit Approach", "description": "Effort focused where the risk to your business is greatest."},
                {"icon": "FiLock", "title": "Confidential Data Handling", "description": "Your financial information handled with strict confidentiality."},
                {"icon": "FiClock", "title": "Timely Completion", "description": "Audits completed within agreed timelines, without cutting corners."},
                {"icon": "FiHeadphones", "title": "Personalized Client Support", "description": "A dedicated point of contact who understands your business."},
            ],
        },
        "benefits": {
            "tagline": "The Payoff",
            "heading_prefix": "Benefits of a Professional",
            "heading_highlight": "Audit",
            "intro": "A well-run audit does more than satisfy a statutory requirement -it gives you a clear, trustworthy picture of your business at every stage.",
            "items": [
                "Better financial transparency",
                "Strong internal controls",
                "Improved compliance",
                "Reduced business risks",
                "Reliable financial reporting",
                "Better operational efficiency",
                "Increased stakeholder confidence",
                "Practical business recommendations",
            ],
        },
        "industries": {
            "intro": "Audit priorities look different across sectors -our experience spans them all.",
            "items": [
                {"icon": "FiTool", "label": "Manufacturing", "blurb": "Cost, inventory and process controls reviewed."},
                {"icon": "FiShoppingCart", "label": "Trading", "blurb": "Purchase and sales records verified end to end."},
                {"icon": "FiHeadphones", "label": "Service Sector", "blurb": "Revenue recognition and billing audited closely."},
                {"icon": "FiZap", "label": "Startups", "blurb": "Sound financial foundations from an early stage."},
                {"icon": "FiGrid", "label": "MSMEs", "blurb": "Right-sized audit scope for growing teams."},
                {"icon": "FiBriefcase", "label": "Private Limited Companies", "blurb": "Statutory audits handled with full rigour."},
                {"icon": "FiLayers", "label": "LLPs", "blurb": "Compliance and control reviews built for LLPs."},
                {"icon": "FiUsers", "label": "Partnership Firms", "blurb": "Independent review of shared financial records."},
                {"icon": "FiHeart", "label": "NGOs", "blurb": "Grant utilisation and compliance verified carefully."},
                {"icon": "FiUserCheck", "label": "Professionals", "blurb": "Straightforward assurance for practices."},
            ],
        },
        # AuditAssurance/components/FAQSection.jsx (unlike Accounting's) is
        # still fully static - transcribed verbatim below so it can move to
        # service_faqs.
        "faqs": [
            {"question": "What is a statutory audit?", "answer": "A statutory audit is an independent examination of a company's financial statements, required by law for companies and certain other entities, to confirm that the accounts present a true and fair view and comply with applicable accounting standards."},
            {"question": "Who requires a tax audit?", "answer": "Businesses and professionals whose turnover or gross receipts cross the prescribed threshold under the Income Tax Act are required to get a tax audit done. We assess whether your business falls within scope and manage the audit end to end."},
            {"question": "Why is an internal audit important?", "answer": "An internal audit reviews your processes and controls from the inside, catching inefficiencies, control gaps and risks before they become costly problems -it's a proactive check, not just a compliance exercise."},
            {"question": "How long does an audit take?", "answer": "Timelines vary with the size and complexity of the business, but most statutory and tax audits are completed within a few weeks once records are made available. We agree a clear timeline with you at the planning stage."},
            {"question": "What documents are required?", "answer": "Typically we need your books of account, bank statements, invoices, prior audit reports, statutory registers and supporting schedules. We share a detailed checklist tailored to your specific audit at the start of the engagement."},
            {"question": "Can you assist with audit compliance?", "answer": "Yes. Beyond conducting the audit, we help you act on the findings -closing gaps, tightening controls and meeting every applicable statutory or regulatory requirement flagged in the report."},
            {"question": "Do you provide audit reports with recommendations?", "answer": "Yes. Every audit we deliver includes clear management observations alongside the formal report, with practical, prioritised recommendations rather than just a list of findings."},
            {"question": "How often should internal audits be conducted?", "answer": "It depends on the size and risk profile of the business, but most organisations benefit from an internal audit cycle of once or twice a year. We help you decide a cadence that fits your operations."},
        ],
        "cta": {
            "heading": "Need Professional Audit & Assurance Services?",
            "description": "Strengthen your financial reporting, ensure regulatory compliance, and improve business performance with our comprehensive Audit & Assurance services. Our experienced professionals deliver reliable audits that help businesses build trust and make informed decisions.",
        },
    },
]


def seed_service_pages():
    counts = {
        "services_created": 0,
        "services_updated": 0,
        "overview_paragraphs": 0,
        "overview_highlights": 0,
        "features": 0,
        "process_steps": 0,
        "why_choose_us_items": 0,
        "benefits": 0,
        "industries": 0,
        "faqs": 0,
    }
    faq_skipped_slugs = []

    for svc in SERVICE_DEFS:
        defaults = {
            "name": svc["name"],
            "category": svc["category"],
            "badge_label": svc["badge_label"],
            "sort_order": svc["sort_order"],
            "is_active": True,
            "hero_breadcrumb_label": svc["hero"]["breadcrumb_label"],
            "hero_title_prefix": svc["hero"]["title_prefix"],
            "hero_title_highlight": svc["hero"]["title_highlight"],
            "hero_description": svc["hero"]["description"],
            "overview_tagline": svc["overview"]["tagline"],
            "overview_heading_prefix": svc["overview"]["heading_prefix"],
            "overview_heading_highlight": svc["overview"]["heading_highlight"],
            "features_tagline": svc["features"]["tagline"],
            "features_heading_prefix": svc["features"]["heading_prefix"],
            "features_heading_highlight": svc["features"]["heading_highlight"],
            "features_intro": svc["features"]["intro"],
            "process_intro": svc["process"]["intro"],
            "why_choose_us_intro": svc["why_choose_us"]["intro"],
            "why_choose_us_image_alt": svc["why_choose_us"]["image_alt"],
            "benefits_tagline": svc["benefits"]["tagline"],
            "benefits_heading_prefix": svc["benefits"]["heading_prefix"],
            "benefits_heading_highlight": svc["benefits"]["heading_highlight"],
            "benefits_intro": svc["benefits"]["intro"],
            "industries_intro": svc["industries"]["intro"],
            "cta_heading": svc["cta"]["heading"],
            "cta_description": svc["cta"]["description"],
        }

        service, created = get_or_create(Service, {"slug": svc["slug"]}, defaults)
        if created:
            counts["services_created"] += 1
        else:
            counts["services_updated"] += 1

        ServiceOverviewParagraph.query.filter_by(service_id=service.id).delete()
        for i, paragraph in enumerate(svc["overview"]["paragraphs"]):
            db.session.add(ServiceOverviewParagraph(service_id=service.id, content=paragraph, sort_order=i))
            counts["overview_paragraphs"] += 1

        ServiceOverviewHighlight.query.filter_by(service_id=service.id).delete()
        for i, highlight in enumerate(svc["overview"]["highlights"]):
            db.session.add(ServiceOverviewHighlight(service_id=service.id, content=highlight, sort_order=i))
            counts["overview_highlights"] += 1

        ServiceFeature.query.filter_by(service_id=service.id).delete()
        for i, item in enumerate(svc["features"]["items"]):
            db.session.add(
                ServiceFeature(
                    service_id=service.id,
                    icon=item["icon"],
                    title=item["title"],
                    description=item["description"],
                    sort_order=i,
                )
            )
            counts["features"] += 1

        ServiceProcessStep.query.filter_by(service_id=service.id).delete()
        for i, step in enumerate(svc["process"]["steps"]):
            db.session.add(
                ServiceProcessStep(
                    service_id=service.id,
                    icon=step["icon"],
                    title=step["title"],
                    description=step["description"],
                    sort_order=i,
                )
            )
            counts["process_steps"] += 1

        ServiceWhyChooseUs.query.filter_by(service_id=service.id).delete()
        for i, item in enumerate(svc["why_choose_us"]["items"]):
            db.session.add(
                ServiceWhyChooseUs(
                    service_id=service.id,
                    icon=item["icon"],
                    title=item["title"],
                    description=item["description"],
                    sort_order=i,
                )
            )
            counts["why_choose_us_items"] += 1

        ServiceBenefit.query.filter_by(service_id=service.id).delete()
        for i, benefit_text in enumerate(svc["benefits"]["items"]):
            db.session.add(
                ServiceBenefit(
                    service_id=service.id,
                    icon=None,
                    title=benefit_text,
                    description=None,
                    sort_order=i,
                )
            )
            counts["benefits"] += 1

        ServiceIndustry.query.filter_by(service_id=service.id).delete()
        for i, industry in enumerate(svc["industries"]["items"]):
            db.session.add(
                ServiceIndustry(
                    service_id=service.id,
                    icon=industry["icon"],
                    label=industry["label"],
                    blurb=industry["blurb"],
                    sort_order=i,
                )
            )
            counts["industries"] += 1

        if svc["faqs"] is None:
            faq_skipped_slugs.append(svc["slug"])
        else:
            ServiceFaq.query.filter_by(service_id=service.id).delete()
            for i, faq in enumerate(svc["faqs"]):
                db.session.add(
                    ServiceFaq(
                        service_id=service.id,
                        question=faq["question"],
                        answer=faq["answer"],
                        sort_order=i,
                    )
                )
                counts["faqs"] += 1

        db.session.flush()

    return counts, faq_skipped_slugs


def main():
    app = create_app()
    with app.app_context():
        counts, faq_skipped_slugs = seed_service_pages()

        db.session.commit()

        print("\n" + "=" * 70)
        print("SUMMARY (seed_service_pages.py)")
        print("=" * 70)
        print(f"services created           {counts['services_created']}")
        print(f"services updated           {counts['services_updated']}")
        print(f"overview_paragraphs rows   {counts['overview_paragraphs']}")
        print(f"overview_highlights rows   {counts['overview_highlights']}")
        print(f"service_features rows      {counts['features']}")
        print(f"service_process_steps rows {counts['process_steps']}")
        print(f"service_why_choose_us rows {counts['why_choose_us_items']}")
        print(f"service_benefits rows      {counts['benefits']}")
        print(f"service_industries rows    {counts['industries']}")
        print(f"service_faqs rows          {counts['faqs']}")

        if faq_skipped_slugs:
            print(
                "\nFAQs intentionally left untouched for: "
                + ", ".join(faq_skipped_slugs)
                + " (no local FAQ content in source - already served from the DB via seed_data.py)."
            )

        print("\nOut of scope (not touched by this script): gst-services, income-tax-advisory, tds-compliance")

        print("\n" + "=" * 70)
        print("VERIFICATION")
        print("=" * 70)
        for svc in SERVICE_DEFS:
            service = Service.query.filter_by(slug=svc["slug"]).first()
            print(
                f"{service.slug:32s} category={service.category:22s} "
                f"faqs={len(service.faqs)} features={len(service.features)} "
                f"benefits={len(service.benefits)} industries={len(service.industries)}"
            )


if __name__ == "__main__":
    main()
