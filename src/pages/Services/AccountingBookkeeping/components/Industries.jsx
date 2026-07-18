import { motion } from "framer-motion";
import {
  FiZap,
  FiHome,
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiLayers,
  FiUserCheck,
  FiTool,
  FiShoppingCart,
  FiHeadphones,
} from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.05 * i, ease: EASE },
  }),
};

const industries = [
  { icon: FiZap, label: "Startups", blurb: "Clean books from day one." },
  { icon: FiHome, label: "Small Businesses", blurb: "Right-sized accounting support." },
  { icon: FiGrid, label: "MSMEs", blurb: "Organized records as you scale." },
  { icon: FiUsers, label: "Partnership Firms", blurb: "Shared finances, tracked clearly." },
  { icon: FiBriefcase, label: "Private Limited Companies", blurb: "Statutory-ready financial statements." },
  { icon: FiLayers, label: "LLPs", blurb: "Compliant, well-maintained ledgers." },
  { icon: FiUserCheck, label: "Professionals", blurb: "Simple bookkeeping for practices." },
  { icon: FiTool, label: "Manufacturing", blurb: "Cost and inventory tracked accurately." },
  { icon: FiShoppingCart, label: "Trading Businesses", blurb: "Purchases and sales reconciled fast." },
  { icon: FiHeadphones, label: "Service Providers", blurb: "Billing and expenses kept in sync." },
];

export const Industries = () => {
  return (
    <section id="industries" className="scroll-mt-28">
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
          Who We Work With
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Industries <span className="text-brand-700">We Serve</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
          Bookkeeping needs look different across sectors -our experience spans them all.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {industries.map((industry, i) => {
          const Icon = industry.icon;
          return (
            <motion.div
              key={industry.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="group rounded-xl border border-secondary/10 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-black">{industry.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-black/60">{industry.blurb}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
