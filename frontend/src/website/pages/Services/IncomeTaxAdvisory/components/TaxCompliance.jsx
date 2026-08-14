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
    title: "Income Estimation",
    description: "Estimation of income for the year to determine the advance tax liability that applies.",
  },
  {
    icon: FiClock,
    title: "Advance Tax Instalments",
    description: "Computation of advance tax instalments and their deposit within the due dates prescribed under the Act.",
  },
  {
    icon: FiRepeat,
    title: "Self-Assessment Tax",
    description: "Computation and deposit of self-assessment tax before filing the return of income.",
  },
  {
    icon: FiEye,
    title: "Interest Review",
    description: "Review of interest under Sections 234A, 234B and 234C arising from delayed filing or short payment of advance tax.",
  },
];

export const TaxCompliance = () => {
  const reduced = useReducedMotion();

  return (
    <section id="tax-compliance" className="scroll-mt-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <motion.span
          variants={fadeUp}
          custom={0}
          className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
        >
          
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Advance Tax <span className="text-brand-700">&amp; Self-Assessment</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Estimation of income, computation of advance tax instalments and deposit of
          self-assessment tax, with review of interest under Sections 234A, 234B and 234C.
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
