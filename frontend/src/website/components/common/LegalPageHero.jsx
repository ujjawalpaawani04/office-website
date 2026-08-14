import { motion } from "framer-motion";
import { Breadcrumb } from "./Breadcrumb";
import { Container } from "./Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

/**
 * Shared hero for the site's short, static legal/reference pages (Privacy
 * Policy, Terms, Disclaimer) - same background/overlay/breadcrumb treatment
 * as ContactHero.jsx, but shorter (no CTA row - there's no action to drive
 * on these pages) matching KnowledgeCentre.jsx's shorter hero for the same
 * reason.
 * `title` accepts JSX so callers can highlight part of it, matching every
 * other hero on the site (e.g. `Privacy <span className="text-highlight">Policy</span>`).
 */
export const LegalPageHero = ({ breadcrumbLabel, title, description }) => {
  return (
    <section className="relative isolate flex min-h-[55vh] w-full items-center overflow-hidden bg-secondary pb-16 lg:pb-0 pt-25 lg:min-h-0 lg:h-[55vh] lg:max-h-[560px]">
      <img
        src="/about-images/bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
      <div className="absolute inset-0 -z-10 bg-secondary/25" />

      <Container className="relative">
        <div className="max-w-3xl">
          <Breadcrumb items={[{ label: breadcrumbLabel }]} delay={4} />

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {description}
          </motion.p>
        </div>
      </Container>
    </section>
  );
};
