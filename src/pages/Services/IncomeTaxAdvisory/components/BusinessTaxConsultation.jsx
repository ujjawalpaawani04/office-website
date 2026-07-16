import { motion } from "framer-motion";
import { FiUser, FiUsers, FiLayers, FiBriefcase, FiZap, FiGrid } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.06 * i, ease: EASE },
  }),
};

const businessTypes = [
  { icon: FiUser, label: "Proprietorship" },
  { icon: FiUsers, label: "Partnership" },
  { icon: FiLayers, label: "LLP" },
  { icon: FiBriefcase, label: "Private Limited" },
  { icon: FiZap, label: "Startup" },
  { icon: FiGrid, label: "MSME" },
];

export const BusinessTaxConsultation = () => {
  return (
    <section id="business-tax" className="scroll-mt-0">
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
          Business Tax <span className="text-brand-700">Consultation</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Tax advisory shaped by your business structure -the obligations of a
          proprietorship look nothing like those of a private limited company, and we plan
          accordingly.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {businessTypes.map((business, i) => {
          const Icon = business.icon;
          return (
            <motion.div
              key={business.label}
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
              <h3 className="mt-3 text-sm font-semibold text-black">{business.label}</h3>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
