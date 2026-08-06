import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { getServiceBySlug } from "../../api/services";
import { ServicePage } from "./serviceTemplate/ServicePage";
import { buildServiceConfig } from "./serviceTemplate/buildServiceConfig";

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

  return (
    <>
      <Seo
        title={service.name}
        description={service.shortDescription || service.heroDescription}
        canonicalPath={`/services/${service.slug}`}
      />
      <ServicePage config={buildServiceConfig(service)} />
    </>
  );
};

export default DynamicServicePage;
