import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiRepeat, FiTrendingUp, FiAlertOctagon } from "react-icons/fi";

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
    title: "ITC Eligibility",
    description: "Confirming which purchases genuinely qualify for input tax credit.",
  },
  {
    icon: FiFileText,
    title: "Documentation",
    description: "Ensuring every invoice meets the documentation standard credit requires.",
  },
  {
    icon: FiRepeat,
    title: "Matching Invoices",
    description: "Cross-checking your purchase records against GSTR-2B, line by line.",
  },
  {
    icon: FiTrendingUp,
    title: "Claim Optimization",
    description: "Making sure no eligible credit is left unclaimed at filing time.",
  },
  {
    icon: FiAlertOctagon,
    title: "Common Mistakes",
    description: "Flagging the errors that most often trigger mismatches or notices.",
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
          Input Tax Credit <span className="text-brand-700">(ITC)</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          ITC is where businesses most often leave money on the table -or run into trouble.
          We manage it carefully, end to end.
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
