import { motion, useReducedMotion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { partners, firmStats } from "../../../data/partners";
import { PartnerCard } from "./PartnerCard";
import { AchievementStrip } from "./AchievementStrip";

const EASE = [0.22, 1, 0.36, 1];

export const Partners = () => {
  const shouldReduceMotion = useReducedMotion();
  const [featuredPartner, ...otherPartners] = partners;

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.7,
        delay: shouldReduceMotion ? 0 : 0.12 * i,
        ease: EASE,
      },
    }),
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-brand-50 to-white"
      />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-700/20 bg-brand-700/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700"
          >
            <FiAward className="h-3.5 w-3.5" aria-hidden="true" />
            Our Leadership
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-4 font-display text-3xl font-bold leading-[1.15] text-black sm:text-4xl lg:text-5xl"
          >
            Meet Our <span className="text-brand-700">Partners</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black"
          >
            Our leadership brings together decades of combined expertise in taxation, audit, and
            business advisory - guiding every client relationship with integrity, precision, and a
            genuine commitment to your success.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            aria-hidden="true"
            className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-700 via-highlight to-gold-500"
          />
        </motion.div>

        <div className="mt-14">
          <PartnerCard partner={featuredPartner} variant="featured" index={0} />
        </div>

        <AchievementStrip stats={firmStats} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherPartners.map((partner, i) => (
            <PartnerCard key={partner.id} partner={partner} variant="standard" index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};
