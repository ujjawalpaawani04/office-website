import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPhoneCall } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { getServices } from "../../api/services";
import { primaryPhone, telHref, useSiteSettings } from "../../context/SiteSettingsContext";

const CATEGORY_LABELS = {
  our_services: "Our Services",
  corporate_specialised: "Corporate & Specialised Services",
};
const CATEGORY_ORDER = ["our_services", "corporate_specialised"];

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const ServicesIndex = () => {
  const { phone } = useSiteSettings();
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

      <section className="relative isolate flex min-h-[70vh] w-full items-center overflow-hidden bg-secondary pb-16 lg:pb-0 pt-25 lg:min-h-0 lg:h-[70vh] lg:max-h-[700px]">
        <img
          src="/about-images/bg1.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
        <div className="absolute inset-0 -z-10 bg-secondary/25" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-highlight/10 blur-3xl" />
          <div className="absolute bottom-0 left-[6%] h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="max-w-3xl">
            <Breadcrumb items={[{ label: "Services" }]} delay={5} />

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
            >
              Our <span className="text-highlight">Services</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
            >
              The firm provides the following professional services from its office at Roorkee,
              Uttarakhand - income tax, GST, TDS compliance, audit and assurance, accounting, ROC,
              RERA and land law compliance among them.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/appointment"
                className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
              >
                Book a Consultation
                <FiArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={telHref(primaryPhone(phone))}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <FiPhoneCall className="h-4 w-4" aria-hidden="true" />
                Contact Our Experts
              </a>
            </motion.div>
          </div>
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
