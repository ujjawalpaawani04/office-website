import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { Breadcrumb } from "../../../components/common/Breadcrumb";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const InsightsHero = () => {
  return (
    <section className="relative isolate flex min-h-[62vh] w-full items-center overflow-hidden bg-secondary pb-16 pt-36 lg:pt-40">
      <img
        src="/about-images/bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/50" />
      <div className="absolute inset-0 -z-10 bg-secondary/25" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-highlight/10 blur-3xl"
      />

      <Container className="relative">
        <div className="max-w-2xl">
          

          <Breadcrumb items={[{ label: "Blog & Articles" }]} />

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
          >
            Blog <span className="text-highlight">&amp; Articles</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Stay updated with expert insights on taxation, GST, audit, compliance, finance, and
            business advisory from SAA professionals.
          </motion.p>
        </div>
      </Container>
    </section>
  );
};
