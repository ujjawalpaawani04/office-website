import { motion } from "framer-motion";
import { FiPercent, FiCheckCircle } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const highlights = [
  "Income Tax Return Filing",
  "Tax Planning",
  "Tax Advisory",
  "Tax Compliance",
  "Professional Guidance",
  "Hassle-Free Process",
];

export const Overview = () => {
  return (
    <section id="overview" className="scroll-mt-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Overview
          </motion.span>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Your Trusted Partner for{" "}
            <span className="text-brand-700">Income Tax Solutions</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="mt-6 text-base leading-relaxed text-secondary/70"
          >
            India's tax landscape keeps evolving - new regimes, tighter reporting
            standards and faster digital scrutiny. We offer comprehensive income tax
            services for individuals, professionals, firms and companies, including
            accurate ITR filing, forward-looking tax planning and practical tax advisory
            to help clients meet their obligations efficiently.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={3}
            className="mt-4 text-base leading-relaxed text-secondary/70"
          >
            Our approach blends hands-on professional experience with technology-driven
            precision - reconciling your records against statements like Form 26AS and the
            AIS, and turning day-to-day compliance into a hassle-free, dependable process
            at every step.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {highlights.map((highlight, i) => (
              <motion.li
                key={highlight}
                variants={fadeUp}
                custom={4 + i}
                className="flex items-center gap-3"
              >
                <FiCheckCircle className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="text-sm font-medium text-secondary/80">{highlight}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right side - premium illustration card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute -top-8 -right-8 h-56 w-56 rounded-full bg-brand-700/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -left-8 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-2xl border border-brand-700/10 bg-gradient-to-br from-white to-brand-50 p-10 shadow-xl sm:p-14">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-accent text-white shadow-lg shadow-brand-700/30 sm:h-28 sm:w-28">
              <FiPercent className="h-11 w-11 sm:h-12 sm:w-12" aria-hidden="true" />
            </div>

            <p className="mt-8 text-center font-display text-xl font-bold text-secondary sm:text-2xl">
              Precision-Driven Tax Advisory
            </p>
            <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-secondary/60">
              Every return reviewed, every deduction accounted for.
            </p>

            {/* Floating stat chips */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-brand-700/10 bg-white p-4 text-center shadow-sm">
                <p className="font-display text-2xl font-bold text-brand-700">1000+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary/60">
                  Returns Filed
                </p>
              </div>
              <div className="rounded-xl border border-brand-700/10 bg-white p-4 text-center shadow-sm">
                <p className="font-display text-2xl font-bold text-brand-700">100%</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary/60">
                  Compliance Focus
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
