import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGlobe } from "react-icons/fi";
import { TbBuildingBank, TbShieldCheck, TbCertificate } from "react-icons/tb";
import { getCertifications } from "../../../api/firmStats";

const EASE = [0.22, 1, 0.36, 1];
const TEAL = "#0D8A82";
const DARK = "#1D1D1D";
const GRAY = "#555555";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.12 * i, ease: EASE },
  }),
};

// No dedicated icon field in the DB; cycle through this fixed set by index.
const ICONS_CYCLE = [TbBuildingBank, FiGlobe, TbShieldCheck, TbCertificate];

const mapCertification = (c, i) => ({
  icon: ICONS_CYCLE[i % ICONS_CYCLE.length],
  title: c.name,
  subtitle: c.issuingBody,
  description: c.description,
});

export const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCertifications()
      .then((data) => {
        if (cancelled) return;
        setCertifications(Array.isArray(data) ? data.map(mapCertification) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load certifications:", err);
        setError("Unable to load certifications right now.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-[100px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-[1320px] px-6 text-center lg:px-8"
      >
        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-center gap-4"
        >
          
          <span
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
            style={{ color: TEAL, letterSpacing: "4px" }}
          >
            Our Credentials
          </span>
          
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          <span style={{ color: DARK }}>Official </span>
          <span style={{ color: TEAL }}>Certifications</span>
        </motion.h2>

        

        {/* Trust line */}
        <motion.p
          variants={fadeUp}
          custom={3}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-base"
          style={{ color: "#333333" }}
        >
          <span aria-hidden="true" style={{ color: TEAL }}>
            &bull;
          </span>
          <span>Trusted</span>
          <span aria-hidden="true" style={{ color: TEAL }}>
            &bull;
          </span>
          <span>Verified</span>
          <span aria-hidden="true" style={{ color: TEAL }}>
            &bull;
          </span>
          <span>Government Approved</span>
        </motion.p>

        {isLoading && (
          <p className="mt-14 text-sm text-black/60" aria-busy="true" aria-live="polite">
            Loading certifications...
          </p>
        )}

        {!isLoading && error && (
          <p className="mt-14 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && certifications.length === 0 && (
          <p className="mt-14 text-sm text-black/60">No certifications to show yet.</p>
        )}

        {/* Cards - seal/certificate motif: icon badge top-left, accent bar,
            left-aligned copy. Only cert.icon/title/subtitle/description are
            used (same 3 DB fields the admin panel already edits - name,
            issuingBody, description - mapped in mapCertification() above),
            so this redesign needs no backend/admin change. */}
        {!isLoading && !error && certifications.length > 0 && (
        <div className="mt-14 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.title}
                variants={fadeUp}
                custom={4 + i}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 22px 50px rgba(13,138,130,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.06)";
                }}
              >
                {/* Top accent bar */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: TEAL }}
                />

                {/* Icon badge */}
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${TEAL}14` }}
                >
                  <Icon className="h-6 w-6" style={{ color: TEAL }} aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-xl leading-snug font-bold" style={{ color: DARK }}>
                  {cert.title}
                </h3>

                {/* Subtitle as a small pill badge */}
                <span
                  className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: `${TEAL}14`, color: TEAL }}
                >
                  {cert.subtitle}
                </span>

                {/* Description */}
                <p className="mt-4 text-sm leading-[1.75]" style={{ color: GRAY }}>
                  {cert.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        )}
      </motion.div>
    </section>
  );
};
