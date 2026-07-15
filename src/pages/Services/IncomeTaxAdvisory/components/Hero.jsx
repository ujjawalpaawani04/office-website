import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronRight, FiPhoneCall } from "react-icons/fi";
import { Container } from "../../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const Hero = () => {
  return (
    <section className="relative isolate flex h-[100vh] max-h-[900px] w-full items-center overflow-hidden bg-secondary pb-16 lg:pb-0 pt-25">
      <img
        src="/about-images/bg1.png"
        alt="Income Tax Advisory Background"
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
      <div className="absolute inset-0 -z-10 bg-secondary/25" />

      {/* Decorative background shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute bottom-0 left-[6%] h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-highlight bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-highlight backdrop-blur-sm"
          >
            Income Tax Services
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3.2rem]"
          >
            Income Tax <span className="text-highlight">&amp; Advisory</span>
          </motion.h1>


          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Provide comprehensive income tax solutions including ITR filing, tax planning,
            tax advisory, compliance and representation services to help clients manage their
            tax obligations efficiently while maximizing available tax benefits.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-secondary shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              Get Tax Consultation
              <FiArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <a
              href="tel:+911204000350"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiPhoneCall className="h-4 w-4" aria-hidden="true" />
              Talk to an Expert
            </a>
          </motion.div>

          <motion.nav
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            aria-label="Breadcrumb"
            className="mt-10 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/50"
          >
            <Link to="/" className="transition-colors hover:text-highlight">
              Home
            </Link>
            <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Services</span>
            <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-white/80" aria-current="page">
              Income Tax &amp; Advisory
            </span>
          </motion.nav>
        </div>
      </Container>
    </section>
  );
};
