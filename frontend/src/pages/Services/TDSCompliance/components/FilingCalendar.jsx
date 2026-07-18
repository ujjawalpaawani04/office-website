import { motion } from "framer-motion";
import { FiFileText, FiClipboard, FiGlobe, FiAward, FiUsers, FiRefreshCw } from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.06 * i, ease: EASE },
  }),
};

const frequencyStyles = {
  Quarterly: "border-accent/40 bg-accent/10 text-accent",
  Annual: "border-gold-500/40 bg-gold-500/10 text-gold-600",
  Ongoing: "border-secondary/20 bg-secondary/5 text-black",
};

const filings = [
  {
    icon: FiFileText,
    name: "Form 24Q",
    frequency: "Quarterly",
    description: "Quarterly statement of tax deducted from salary payments.",
  },
  {
    icon: FiClipboard,
    name: "Form 26Q",
    frequency: "Quarterly",
    description: "Quarterly statement of tax deducted on payments other than salary.",
  },
  {
    icon: FiGlobe,
    name: "Form 27Q",
    frequency: "Quarterly",
    description: "Quarterly statement of tax deducted on payments to non-residents.",
  },
  {
    icon: FiAward,
    name: "Form 16",
    frequency: "Annual",
    description: "Annual TDS certificate issued to employees after year-end.",
  },
  {
    icon: FiUsers,
    name: "Form 16A",
    frequency: "Quarterly",
    description: "Certificate for TDS deducted on non-salary payments, issued each quarter.",
  },
  {
    icon: FiRefreshCw,
    name: "Reconciliation Review",
    frequency: "Ongoing",
    description: "Deductions matched against deposits and Form 26AS ahead of every filing.",
  },
];

export const FilingCalendar = () => {
  return (
    <section id="tds-return-filing" className="scroll-mt-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <motion.span
          variants={fadeUp}
          custom={0}
          className="text-sm font-semibold uppercase tracking-widest text-brand-700"
        >
          Filing Cadence
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          TDS Filing <span className="text-brand-700">Calendar</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          A quick reference for what's due, and when, across your TDS filing cycle.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filings.map((filing, i) => {
          const Icon = filing.icon;
          return (
            <motion.div
              key={filing.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="group rounded-2xl border border-secondary/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 text-brand-700 transition-all duration-300 group-hover:from-brand-700 group-hover:to-accent group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                    frequencyStyles[filing.frequency]
                  )}
                >
                  {filing.frequency}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-black">{filing.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black">
                {filing.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
