import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const AboutHero = () => {
  return (
    <section className="relative isolate bg-gradient-to-b from-secondary to-white py-20 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-700/5 via-transparent to-transparent" />

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700"
          >
            Our Journey
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mt-6 font-display text-4xl font-bold leading-[1.2] text-secondary sm:text-5xl lg:text-[3.2rem]"
          >
            Two Decades of <span className="text-brand-700">Trusted Excellence</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="mt-6 text-base leading-relaxed text-secondary/75 sm:text-lg"
          >
            Since our inception, we've been committed to delivering world-class chartered accountancy services across India. Our team of experienced professionals combines expertise with innovation to solve complex financial challenges for businesses of all sizes.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={3}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Work With Us
            </Link>
            <a
              href="#our-story"
              className="inline-flex items-center gap-2 rounded-md border border-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-brand-700 transition-all duration-300 hover:bg-brand-700/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
