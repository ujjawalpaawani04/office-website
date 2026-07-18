import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiHome,
  FiHeart,
  FiBookOpen,
  FiTool,
  FiKey,
  FiUserCheck,
  FiZap,
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

const groups = [
  { icon: FiBriefcase, label: "Businesses & Companies", blurb: "Salary, contractor and fee deductions handled correctly." },
  { icon: FiHome, label: "Government Departments", blurb: "Deduction and deposit aligned with public-sector requirements." },
  { icon: FiHeart, label: "Trusts & NGOs", blurb: "Compliance support for grants, salaries and vendor payments." },
  { icon: FiBookOpen, label: "Educational Institutions", blurb: "TDS on staff salaries and vendor contracts managed accurately." },
  { icon: FiTool, label: "Contractors & Builders", blurb: "Deductions on contract payments tracked project by project." },
  { icon: FiKey, label: "Landlords & Tenants", blurb: "Rent TDS deducted and deposited within the applicable limits." },
  { icon: FiUserCheck, label: "Professionals & Consultants", blurb: "Fee-based TDS obligations met without missed deadlines." },
  { icon: FiZap, label: "Startups", blurb: "Compliance built in from the very first payroll run." },
];

export const WhoNeedsTDS = () => {
  return (
    <section id="who-needs-tds" className="scroll-mt-28">
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
          Who Needs <span className="text-brand-700">TDS Compliance</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          TDS obligations play out differently across sectors -our experience spans them all.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {groups.map((group, i) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={group.label}
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
              <h3 className="mt-3 text-sm font-semibold text-black">{group.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-black/60">{group.blurb}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
