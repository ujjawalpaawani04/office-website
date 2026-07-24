import { motion, useReducedMotion } from "framer-motion";
import { FiFilePlus, FiCalendar, FiRepeat, FiEye, FiFolder, FiArchive } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const checks = [
  { icon: FiFilePlus, title: "GST Registration Status", description: "Registration kept active and details always current." },
  { icon: FiCalendar, title: "Return Filing", description: "Every monthly, quarterly and annual return filed up to date." },
  { icon: FiRepeat, title: "ITC Reconciliation", description: "Purchases matched against GSTR-2B, so nothing goes unclaimed." },
  { icon: FiEye, title: "Compliance Review", description: "Ongoing checks to keep your GST position on track." },
  { icon: FiFolder, title: "Documentation", description: "Invoices and supporting records kept complete and audit-ready." },
  { icon: FiArchive, title: "Annual Filing", description: "GSTR-9 and GSTR-9C prepared well ahead of schedule." },
];

export const ComplianceHealthCheck = () => {
  const reduced = useReducedMotion();

  return (
    <section id="gst-compliance" className="scroll-mt-28">
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
          GST Compliance <span className="text-brand-700">Health Check</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          A running snapshot of the six areas we monitor to keep your GST position healthy.
        </motion.p>
      </motion.div>

      <div className="relative mt-10">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-6 w-px bg-secondary/10" />
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1, ease: EASE }}
          style={{ transformOrigin: "top" }}
          className="absolute top-2 bottom-2 left-6 w-px bg-gradient-to-b from-brand-700 to-accent"
        />

        <div className="space-y-6">
          {checks.map((check, i) => {
            const Icon = check.icon;
            return (
              <motion.div
                key={check.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="relative flex items-start gap-5"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-md shadow-brand-700/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="rounded-xl border border-secondary/10 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-black">{check.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-black">{check.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
