import { motion } from "framer-motion";
import {
  FiFileText,
  FiPercent,
  FiShield,
  FiBarChart2,
  FiClipboard,
  FiAlertTriangle,
  FiTrendingUp,
  FiHeadphones,
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
    icon: FiFileText,
    title: "Statutory Audit",
    description: "Ensure compliance with applicable laws while providing an independent review of financial statements.",
  },
  {
    icon: FiPercent,
    title: "Tax Audit",
    description: "Comprehensive tax audit services in accordance with Income Tax regulations.",
  },
  {
    icon: FiShield,
    title: "Internal Audit",
    description: "Evaluate internal controls, operational efficiency, and risk management processes.",
  },
  {
    icon: FiBarChart2,
    title: "Financial Statement Audit",
    description: "Independent examination of financial records to enhance credibility and transparency.",
  },
  {
    icon: FiClipboard,
    title: "Compliance Audit",
    description: "Review compliance with applicable statutory and regulatory requirements.",
  },
  {
    icon: FiAlertTriangle,
    title: "Risk Assessment & Internal Controls",
    description: "Identify business risks and recommend effective control mechanisms.",
  },
  {
    icon: FiTrendingUp,
    title: "Management Reporting",
    description: "Detailed audit observations with practical recommendations for improvement.",
  },
  {
    icon: FiHeadphones,
    title: "Advisory Support",
    description: "Professional guidance to strengthen governance, financial reporting, and business processes.",
  },
];

export const ServicesGrid = () => {
  return (
    <section id="audit-services" className="scroll-mt-28">
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
          Our Audit &amp; <span className="text-brand-700">Assurance Services</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
          Everything your business needs for independent, reliable and well-documented
          audits, under one roof.
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
