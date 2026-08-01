import { FiActivity, FiAward, FiClipboard, FiCompass, FiHome, FiTrendingUp } from "react-icons/fi";
import { getIcon } from "./iconRegistry";

// Moved out of DynamicServicePage.jsx (rather than left there and re-exported)
// so that admin/pages/Services/ServiceEditor.jsx - which needs this pure
// function for its live preview - can import it without also statically
// pulling in the page component, which was defeating that route's
// React.lazy() code-splitting (see routes/AppRoutes.jsx).

// Same 6 generic anchors serviceTemplate/sectionsConfig.js defines, kept in
// sync here so the sidebar can drop any group a service has no content for
// instead of always showing all 6 regardless of what's actually on the page.
const SECTION_DEFS = [
  { id: "overview", label: "Overview", icon: FiHome, hasContent: (s) => s.overviewParagraphs?.length },
  { id: "our-services", label: "Our Services", icon: FiClipboard, hasContent: (s) => s.features?.length },
  { id: "process", label: "Our Process", icon: FiActivity, hasContent: (s) => s.process?.length },
  { id: "why-choose-us", label: "Why Choose Us", icon: FiAward, hasContent: (s) => s.whyChooseUs?.length },
  { id: "benefits", label: "Benefits", icon: FiTrendingUp, hasContent: (s) => s.benefits?.length },
  { id: "industries", label: "Industries We Serve", icon: FiCompass, hasContent: (s) => s.industries?.length },
];

function withIcon(item) {
  return { ...item, icon: getIcon(item.icon) };
}

export function buildServiceConfig(service) {
  return {
    slug: service.slug,
    sidebarTitle: service.name,
    sections: SECTION_DEFS.filter((section) => section.hasContent(service)).map(
      ({ id, label, icon }) => ({ id, label, icon })
    ),
    hero: {
      breadcrumbLabel: service.heroBreadcrumbLabel || service.name,
      titlePre: service.heroTitlePrefix || service.name,
      titleHighlight: service.heroTitleHighlight || "",
      description: service.heroDescription || service.shortDescription || "",
      backgroundImageUrl: service.heroBackgroundImageUrl || undefined,
    },
    overview: {
      tagline: service.overviewTagline || undefined,
      headingPre: service.overviewHeadingPrefix || "",
      headingHighlight: service.overviewHeadingHighlight || "",
      paragraphs: service.overviewParagraphs || [],
      highlights: service.overviewHighlights || [],
    },
    services: {
      tagline: service.featuresTagline || undefined,
      headingPre: service.featuresHeadingPrefix || "",
      headingHighlight: service.featuresHeadingHighlight || "",
      intro: service.featuresIntro || "",
      items: (service.features || []).map(withIcon),
    },
    process: {
      intro: service.processIntro || "",
      steps: (service.process || []).map(withIcon),
    },
    whyChooseUs: {
      intro: service.whyChooseUsIntro || "",
      imageAlt: service.whyChooseUsImageAlt || `${service.name} team`,
      imageUrl: service.whyChooseUsImageUrl || undefined,
      reasons: (service.whyChooseUs || []).map(withIcon),
    },
    benefits: {
      tagline: service.benefitsTagline || undefined,
      headingPre: service.benefitsHeadingPrefix || "",
      headingHighlight: service.benefitsHeadingHighlight || "",
      intro: service.benefitsIntro || "",
      items: (service.benefits || []).map((b) => ({
        title: b.title,
        description: b.description || undefined,
        icon: b.icon ? getIcon(b.icon) : undefined,
      })),
    },
    industries: {
      intro: service.industriesIntro || "",
      items: (service.industries || []).map(withIcon),
    },
    faqs: service.faqs || [],
    cta: {
      heading: service.ctaHeading || "",
      description: service.ctaDescription || "",
      primaryLabel: service.ctaPrimaryLabel || undefined,
    },
  };
}
