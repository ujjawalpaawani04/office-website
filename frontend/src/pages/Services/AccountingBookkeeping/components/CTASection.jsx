import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { Container } from "../../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

export const CTASection = () => {
  return (
    <section
      id="contact"
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-highlight/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl"
          >
            Need Professional Accounting &amp; Bookkeeping Assistance?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Keep your financial records accurate, organized and compliant with our expert
            accounting and bookkeeping services. Focus on growing your business while we
            manage your financial records with precision and professionalism.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              Get Consultation
              <FiArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiMail className="h-4 w-4" aria-hidden="true" />
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
