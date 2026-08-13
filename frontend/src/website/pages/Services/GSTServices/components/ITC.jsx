import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiRepeat, FiAlertOctagon } from "react-icons/fi";

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
    icon: FiCheckCircle,
    title: "Credit Eligibility",
    description: "Review of credit availed against the conditions in Sections 16 and 17.",
  },
  {
    icon: FiAlertOctagon,
    title: "Blocked & Ineligible Credit",
    description: "Identification of blocked and ineligible input tax credit.",
  },
  {
    icon: FiFileText,
    title: "Credit Reversal",
    description: "Reversal computations under Rules 42 and 43.",
  },
  {
    icon: FiRepeat,
    title: "GSTR-2B Matching",
    description: "Matching of input tax credit availed with GSTR-2B.",
  },
];

export const ITC = () => {
  return (
    <section id="itc" className="scroll-mt-28">
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
          Dedicated Focus
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Input Tax Credit <span className="text-brand-700">Review</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Review of credit availed against the conditions in Sections 16 and 17,
          identification of blocked and ineligible credit, and reversal computations under
          Rules 42 and 43.
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
