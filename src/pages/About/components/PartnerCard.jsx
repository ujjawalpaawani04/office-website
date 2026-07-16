import { motion, useReducedMotion } from "framer-motion";
import { FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi";
import { cn } from "../../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const SocialLinks = ({ partner, className }) => {
  if (!partner.social) return null;

  const linkClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-secondary/10 bg-white text-brand-700 shadow-sm transition-colors duration-300 hover:border-brand-700 hover:bg-brand-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {partner.social.linkedin && (
        <a
          href={partner.social.linkedin}
          aria-label={`${partner.name} on LinkedIn`}
          className={linkClass}
        >
          <FiLinkedin className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
      {partner.social.email && (
        <a
          href={partner.social.email === "#" ? "#" : `mailto:${partner.social.email}`}
          aria-label={`Email ${partner.name}`}
          className={linkClass}
        >
          <FiMail className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </div>
  );
};

export const PartnerCard = ({ partner, variant = "standard", index = 0 }) => {
  const isFeatured = variant === "featured";
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.7,
        delay: shouldReduceMotion ? 0 : 0.1 * index,
        ease: EASE,
      },
    },
  };

  if (isFeatured) {
    return (
      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="group relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-brand-700/15 bg-white p-8 shadow-[0_10px_36px_-18px_rgba(1,24,24,0.22)] transition-all duration-300 motion-safe:hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-20px_rgba(1,24,24,0.3)] sm:p-10 lg:p-12"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-highlight to-gold-500"
        />

        <div className="flex flex-col items-center gap-9 text-center lg:flex-row lg:gap-12 lg:text-left">
          <div className="relative shrink-0">
            <div className="rounded-full bg-gradient-to-br from-brand-700 via-highlight to-gold-500 p-[3px] shadow-[0_12px_28px_-12px_rgba(1,24,24,0.35)]">
              <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white bg-brand-50 sm:h-52 sm:w-52">
                <img
                  src={partner.image}
                  alt={`${partner.name}, ${partner.designation}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                />
              </div>
            </div>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-700 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md">
              Managing Partner
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center lg:items-start">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {partner.qualifications.map((q) => (
                <span
                  key={q}
                  className="rounded-full bg-brand-700/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand-700"
                >
                  {q}
                </span>
              ))}
              <span className="inline-flex items-center rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[11px] font-semibold text-gold-600">
                {partner.experience}
              </span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-black sm:text-3xl">
              {partner.name}
            </h3>
            <p className="mt-1.5 text-sm font-semibold uppercase tracking-wide text-brand-700">
              {partner.designation}
            </p>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-black sm:text-base">
              {partner.bio}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {partner.expertise.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-secondary/5 px-2.5 py-1 text-xs font-medium text-black"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href={partner.social?.linkedin ?? "#"}
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                View Profile
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <SocialLinks partner={partner} />
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="group relative flex h-full flex-col items-center rounded-2xl border border-secondary/10 bg-white p-6 text-center shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-highlight hover:shadow-[0_20px_40px_-18px_rgba(1,24,24,0.28)]"
    >
      <div className="rounded-full bg-gradient-to-br from-brand-200 via-brand-100 to-brand-50 p-[2px] transition-colors duration-300 group-hover:from-highlight group-hover:via-highlight group-hover:to-highlight">
        <div className="h-28 w-28 overflow-hidden rounded-full border-[3px] border-white bg-brand-50">
          <img
            src={partner.image}
            alt={`${partner.name}, ${partner.designation}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
          />
        </div>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-black">{partner.name}</h3>
      <p className="mt-0.5 text-sm font-semibold text-brand-700">{partner.designation}</p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {partner.qualifications.map((q) => (
          <span
            key={q}
            className="rounded-full bg-brand-700/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-700"
          >
            {q}
          </span>
        ))}
        <span className="inline-flex items-center rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[10px] font-semibold text-gold-600">
          {partner.experience}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-black line-clamp-2">{partner.bio}</p>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {partner.expertise.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-secondary/5 px-2 py-0.5 text-[11px] font-medium text-black"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto w-full border-t border-secondary/5 pt-4">
        <SocialLinks partner={partner} className="justify-center" />
      </div>
    </motion.article>
  );
};
