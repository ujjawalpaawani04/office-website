import { motion } from "framer-motion";
import { FiTrendingUp, FiPieChart, FiFileMinus, FiShield } from "react-icons/fi";

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
    icon: FiTrendingUp,
    title: "Tax Saving Strategies",
    description:
      "Year-round, forward-looking strategies that reduce your tax outgo within the framework of the law -planned early, not scrambled together in March.",
  },
  {
    icon: FiPieChart,
    title: "Investment Planning",
    description:
      "Aligning your investment decisions with your tax bracket, cash-flow needs and long-term financial goals, not just the filing deadline.",
  },
  {
    icon: FiFileMinus,
    title: "Deductions",
    description:
      "Reviewing every deduction you're entitled to -Sections 80C, 80D and beyond -so nothing you've earned the right to claim is left on the table.",
  },
  {
    icon: FiShield,
    title: "Exemptions",
    description: "Assessing HRA, LTA and other available exemptions carefully, based on your actual salary structure.",
  },
];

export const TaxPlanning = () => {
  return (
    <section id="tax-planning" className="scroll-mt-0">
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
          Tax <span className="text-brand-700">Planning</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Effective tax planning is a year-round discipline, not a March scramble -the
          earlier we start, the more legitimate options stay open to you.
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
              className="group rounded-2xl border border-secondary/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 text-brand-700 transition-all duration-300 group-hover:from-brand-700 group-hover:to-accent group-hover:text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
