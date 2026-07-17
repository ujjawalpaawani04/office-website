import { motion } from "framer-motion";
import {
  FiFilePlus,
  FiCalendar,
  FiRepeat,
  FiFileText,
  FiEye,
  FiAlertOctagon,
  FiCheck,
} from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.06 * i, ease: EASE },
  }),
};

const checks = [
  { icon: FiFilePlus, title: "TDS Deduction", status: "Accurate", dot: "bg-brand-700" },
  { icon: FiCalendar, title: "TDS Deposit", status: "Up to Date", dot: "bg-accent" },
  { icon: FiFileText, title: "Return Filing (24Q/26Q/27Q)", status: "Filed on Time", dot: "bg-gold-500" },
  { icon: FiEye, title: "Form 16 / 16A Issuance", status: "Completed", dot: "bg-brand-500" },
  { icon: FiRepeat, title: "Reconciliation with 26AS", status: "Matched", dot: "bg-gold-600" },
  { icon: FiAlertOctagon, title: "Notices & Corrections", status: "Resolved", dot: "bg-brand-800" },
];

export const ComplianceHealthCheck = () => {
  return (
    <section id="tds-compliance-check" className="scroll-mt-28">
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
          Stay In Control
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          TDS Compliance <span className="text-brand-700">Health Check</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          A running snapshot of the six areas we monitor to keep your TDS position healthy.
        </motion.p>
      </motion.div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-sm">
        <div className="grid divide-y divide-secondary/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
          {checks.map((check, i) => {
            const Icon = check.icon;
            return (
              <motion.div
                key={check.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="group flex items-center gap-4 p-6 transition-colors duration-300 hover:bg-brand-50/50"
              >
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/5 text-black">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white ${check.dot}`}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-black">
                    {check.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-black/60">
                    <FiCheck className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
                    {check.status}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
