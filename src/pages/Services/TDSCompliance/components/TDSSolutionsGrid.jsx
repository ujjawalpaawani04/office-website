import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiFilePlus,
  FiCalendar,
  FiFileText,
  FiTarget,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: 0.06 * i, ease: EASE },
  }),
};

const solutions = [
  {
    index: "01",
    id: undefined,
    icon: FiFilePlus,
    title: "TDS Deduction",
    description: "Accurate deduction of tax at source across salaries, contracts, rent and fees.",
  },
  {
    index: "02",
    id: undefined,
    icon: FiCalendar,
    title: "TDS Deposit",
    description: "Timely deposit of deducted tax to the government within the prescribed due dates.",
  },
  {
    index: "03",
    id: undefined,
    icon: FiCheckCircle,
    title: "TDS Return Filing",
    description: "Quarterly filing of Form 24Q, 26Q and 27Q, prepared and verified before submission.",
  },
  {
    index: "04",
    id: undefined,
    icon: FiFileText,
    title: "Form 16 / Form 16A Issuance",
    description: "Accurate, on-time certificate generation for employees and vendors.",
  },
  {
    index: "05",
    id: "tds-advisory",
    icon: FiTarget,
    title: "TDS Advisory",
    description: "Guidance on applicable sections, rates and exemptions for every payment type.",
  },
  {
    index: "06",
    id: undefined,
    icon: FiCheckCircle,
    title: "TDS Compliance Support",
    description: "Ongoing support to keep every deduction, deposit and filing fully compliant.",
  },
];

export const TDSSolutionsGrid = () => {
  return (
    <section id="tds-services" className="scroll-mt-28">
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
          What We Offer
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Our TDS Compliance <span className="text-brand-700">Services</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Everything your business needs to deduct, deposit, file and stay compliant, under one roof.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              id={item.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-700/40 hover:shadow-xl",
                item.id && "scroll-mt-28"
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-4 font-display text-6xl font-bold text-brand-700/5 transition-colors duration-300 group-hover:text-brand-700/10"
              >
                {item.index}
              </span>

              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white shadow-md shadow-brand-700/20 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="relative mt-5 text-base font-semibold text-black">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-black">
                {item.description}
              </p>

              <Link
                to="/contact"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
              >
                Learn More
                <FiArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
