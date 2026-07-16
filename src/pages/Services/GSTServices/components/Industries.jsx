import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiTool,
  FiShoppingCart,
  FiUserCheck,
  FiGlobe,
  FiZap,
  FiGrid,
  FiBriefcase,
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
  { icon: FiShoppingBag, label: "Retail", blurb: "Point-of-sale to portal, reconciled." },
  { icon: FiTool, label: "Manufacturing", blurb: "Input credit across the production chain." },
  { icon: FiShoppingCart, label: "E-commerce", blurb: "Marketplace and TCS compliance handled." },
  { icon: FiUserCheck, label: "Service Industry", blurb: "Place-of-supply rules applied correctly." },
  { icon: FiGlobe, label: "Export Businesses", blurb: "Zero-rated supplies and refund claims." },
  { icon: FiZap, label: "Startups", blurb: "Registration support from day one." },
  { icon: FiGrid, label: "MSMEs", blurb: "Right-sized compliance for growing teams." },
  { icon: FiBriefcase, label: "Professionals", blurb: "Straightforward filing for practices." },
];

export const Industries = () => {
  return (
    <section id="industries" className="scroll-mt-0">
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
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          GST rules play out differently across sectors -our experience spans them all.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              className="group relative overflow-hidden rounded-2xl border border-secondary/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-accent text-white shadow-md shadow-brand-700/20 transition-transform duration-300 group-hover:rotate-0">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-black">{industry.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-black/60">
                {industry.blurb}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
