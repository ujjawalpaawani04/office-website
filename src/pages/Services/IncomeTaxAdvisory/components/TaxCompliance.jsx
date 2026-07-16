import { motion, useReducedMotion } from "framer-motion";
import { FiFileText, FiClock, FiRepeat, FiEye } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const items = [
  {
    icon: FiFileText,
    title: "Return Filing",
    description: "Statutory income tax returns filed accurately and within due dates.",
  },
  {
    icon: FiClock,
    title: "Advance Tax",
    description: "Quarterly advance tax instalments calculated to avoid interest charges.",
  },
  {
    icon: FiRepeat,
    title: "TDS",
    description: "Deduction, deposit and quarterly TDS return filing kept fully on schedule.",
  },
  {
    icon: FiEye,
    title: "Compliance Monitoring",
    description: "Ongoing tracking of deadlines and regulatory changes throughout the year.",
  },
];

export const TaxCompliance = () => {
  const reduced = useReducedMotion();

  return (
    <section id="tax-compliance" className="scroll-mt-0">
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
          
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Tax <span className="text-brand-700">Compliance</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          A single, continuous compliance calendar -not a scramble at every deadline.
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
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
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
                  <h3 className="text-base font-semibold text-black">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-black">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
