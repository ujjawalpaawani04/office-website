import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiFileText,
  FiLayers,
  FiRepeat,
  FiRefreshCw,
  FiCalendar,
  FiPieChart,
  FiArchive,
} from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.06 * i, ease: EASE },
  }),
};

const services = [
  {
    icon: FiBookOpen,
    title: "Bookkeeping & Ledger Maintenance",
    description: "Day-to-day recording of transactions kept accurate, current and audit-ready.",
  },
  {
    icon: FiFileText,
    title: "Financial Statement Preparation",
    description: "Profit & loss, balance sheet and cash flow statements prepared reliably.",
  },
  {
    icon: FiLayers,
    title: "General Ledger Management",
    description: "A well-organized ledger that keeps every account accurate and reconciled.",
  },
  {
    icon: FiRepeat,
    title: "Accounts Payable & Receivable",
    description: "Vendor payments and customer collections tracked and managed on time.",
  },
  {
    icon: FiRefreshCw,
    title: "Bank Reconciliation",
    description: "Bank statements matched against your books to catch every discrepancy.",
  },
  {
    icon: FiCalendar,
    title: "Monthly & Quarterly Accounting",
    description: "Periodic closing of books so you always know exactly where you stand.",
  },
  {
    icon: FiPieChart,
    title: "Expense Tracking & Reporting",
    description: "Clear visibility into where money is spent, categorized and reported.",
  },
  {
    icon: FiArchive,
    title: "Financial Record Maintenance",
    description: "Systematic storage and upkeep of records for compliance and easy retrieval.",
  },
];

export const ServicesGrid = () => {
  return (
    <section id="accounting-services" className="scroll-mt-28">
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
          Our Accounting &amp; <span className="text-brand-700">Bookkeeping Services</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
          Everything your business needs to keep its books accurate, organized and ready
          for every decision, under one roof.
        </motion.p>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, i) => {
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
              <p className="mt-2 text-sm leading-relaxed text-black">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
