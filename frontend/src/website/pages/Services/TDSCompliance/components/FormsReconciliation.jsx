import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiRepeat, FiEdit3, FiAlertOctagon } from "react-icons/fi";

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
    title: "Form 16 & 16A",
    description: "Issue of Form 16 to employees and Form 16A to other deductees, generated from TRACES.",
  },
  {
    icon: FiCheckCircle,
    title: "Deposit Verification",
    description: "Confirming challans are correctly matched to each deduction entry.",
  },
  {
    icon: FiRepeat,
    title: "Default Notices",
    description: "Review of default notices raised on TRACES for short deduction, short payment and late filing.",
  },
  {
    icon: FiEdit3,
    title: "Correction Statements",
    description: "Filing of correction statements where a default or mismatch is identified.",
  },
  {
    icon: FiAlertOctagon,
    title: "Common Causes",
    description: "Identification of the errors that most often lead to short-deduction or mismatch notices.",
  },
];

export const FormsReconciliation = () => {
  return (
    <section id="forms-reconciliation" className="scroll-mt-28">
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
          Dedicated Focus
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Certificates <span className="text-brand-700">&amp; Corrections</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Issue of TDS certificates, and review of default notices raised on TRACES for short
          deduction, short payment and late filing, together with filing of correction
          statements.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className={`group rounded-2xl border border-secondary/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg ${
                i === items.length - 1 && items.length % 2 !== 0 ? "sm:col-span-2" : ""
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 text-brand-700 transition-all duration-300 group-hover:from-brand-700 group-hover:to-accent group-hover:text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
