import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { getServices } from "../../api/services";

const CATEGORY_LABELS = {
  our_services: "Our Services",
  corporate_specialised: "Corporate & Specialised Services",
};
const CATEGORY_ORDER = ["our_services", "corporate_specialised"];

const ServicesIndex = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getServices()
      .then((data) => {
        if (!cancelled) setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load services right now. Please check back shortly.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white">
      <Seo
        title="Our Services"
        description="Income tax, GST, TDS compliance, audit and assurance, accounting, ROC, RERA and land law compliance services from Singh Amit & Associates, Roorkee."
        canonicalPath="/services"
      />

      <section className="bg-secondary py-16 lg:py-20">
        <Container>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Our Services</h1>
          <p className="mt-3 max-w-2xl text-base text-white/75">
            The firm provides the following professional services from its office at Roorkee, Uttarakhand.
          </p>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          {isLoading ? (
            <p className="text-center text-black/60">Loading...</p>
          ) : error ? (
            <p className="text-center text-black/60">{error}</p>
          ) : services.filter((s) => s.isActive !== false).length === 0 ? (
            <p className="text-center text-black/60">No services are listed right now. Please check back shortly.</p>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const items = services.filter((s) => s.category === category && s.isActive !== false);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-16 last:mb-0">
                  <h2 className="mb-8 font-display text-2xl font-bold text-black">{CATEGORY_LABELS[category]}</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((service) => (
                      <Link
                        key={service.slug}
                        to={`/services/${service.slug}`}
                        className="group flex flex-col rounded-lg border border-brand-700/10 bg-white p-6 transition-all duration-300 hover:border-brand-700/30 hover:shadow-lg"
                      >
                        <h3 className="font-semibold text-lg text-black">{service.name}</h3>
                        {service.shortDescription ? (
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-black/70">{service.shortDescription}</p>
                        ) : null}
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                          Learn more
                          <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </Container>
      </section>
    </div>
  );
};

export default ServicesIndex;
