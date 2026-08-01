import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronRight, FiClock, FiShield, FiUsers } from "react-icons/fi";
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

const trustPoints = [
  { icon: FiClock, label: "Response within 24 hours" },
  { icon: FiUsers, label: "1:1 with a qualified CA" },
  { icon: FiShield, label: "100% confidential" },
];

export const AppointmentHero = () => {
  return (
    <section className="relative isolate flex min-h-[70vh] w-full items-center overflow-hidden bg-secondary pb-16 lg:pb-0 pt-25 lg:min-h-0 lg:h-[70vh] lg:max-h-[700px]">
      <img
        src="/about-images/bg.jpg"
        alt="Book a consultation"
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
      <div className="absolute inset-0 -z-10 bg-secondary/25" />

      <Container className="relative">
        <div className="max-w-3xl">
          <motion.nav
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/50"
          >
            <Link to="/" className="transition-colors hover:text-highlight">
              Home
            </Link>
            <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-white/80" aria-current="page">
              Book a Consultation
            </span>
          </motion.nav>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
          >
            Book Your <span className="text-highlight">Free Consultation</span> With Our Experts
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Pick a slot that works for you and speak directly with a Chartered Accountant about taxation, GST,
            compliance, audit, or business advisory - no waiting, no back-and-forth.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/85">
                <Icon className="h-4 w-4 text-highlight" aria-hidden="true" />
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-10">
            <a
              href="#book-now"
              className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              Choose a Time Slot
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
