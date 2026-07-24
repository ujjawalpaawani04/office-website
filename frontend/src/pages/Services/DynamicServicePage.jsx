import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiActivity, FiAward, FiClipboard, FiCompass, FiHome, FiTrendingUp } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { getServiceBySlug } from "../../api/services";
import { getIcon } from "./serviceTemplate/iconRegistry";
import { ServicePage } from "./serviceTemplate/ServicePage";

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

function buildServiceConfig(service) {
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

const DynamicServicePage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);

    getServiceBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setService(data);
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24" aria-busy="true">
        <Container className="text-center">
          <p className="text-black/60">Loading...</p>
        </Container>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24">
        <Container className="text-center">
          <h1 className="font-display text-3xl font-bold text-black">Service Not Found</h1>
          <p className="mt-3 text-black/60">This service page doesn't exist or is no longer available.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-brand-600"
          >
            Back to Home
          </Link>
        </Container>
      </div>
    );
  }

  return <ServicePage config={buildServiceConfig(service)} />;
};

export default DynamicServicePage;
export { buildServiceConfig };
