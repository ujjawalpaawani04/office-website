import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../../components/common/Container";
import { Hero } from "./serviceTemplate/Hero";
import { FAQSection } from "./serviceTemplate/FAQSection";
import { CTASection } from "./serviceTemplate/CTASection";
import { getServiceBySlug } from "../../api/services";

// Fallback page for services created via the admin panel that don't have a
// bespoke, hand-built page. Renders whatever the admin entered (name,
// descriptions, FAQs) using the shared service page sections.
const ServiceDetail = ({ slug }) => {
  const [service, setService] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    getServiceBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setService(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load service:", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <Container className="py-24 text-center text-sm text-black/60" aria-busy="true" aria-live="polite">
        Loading service...
      </Container>
    );
  }

  if (status === "error" || !service) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-black">Service not found</h1>
        <p className="mt-3 text-sm text-black/60">
          The service you're looking for doesn't exist or is no longer available.
        </p>
      </Container>
    );
  }

  const paragraphs = (service.fullDescription || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div>
      <Hero
        breadcrumbLabel={service.name}
        titlePre=""
        titleHighlight={service.name}
        description={service.shortDescription}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-black/70">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{service.shortDescription}</p>
            )}
          </div>

          {service.faqs?.length > 0 && <FAQSection faqs={service.faqs} idPrefix={service.slug} />}
        </Container>
      </section>

      <CTASection
        heading={`Need help with ${service.name}?`}
        description="Talk to our experts to get started."
      />
    </div>
  );
};

// Remounts ServiceDetail whenever the slug changes so its state resets cleanly.
const GenericServicePage = () => {
  const { slug } = useParams();
  return <ServiceDetail key={slug} slug={slug} />;
};

export default GenericServicePage;
