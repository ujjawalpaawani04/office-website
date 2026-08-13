import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const highlights = [
  "Registration & Amendments",
  "Monthly & Quarterly Returns",
  "Reconciliation",
  "Annual Return (GSTR-9 / GSTR-9C)",
  "Input Tax Credit Review",
  "Notices & Departmental Proceedings",
];

export const ComplianceMatters = () => {
  return (
    <section id="overview" className="scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-1 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Overview
          </motion.span>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Goods and Services <span className="text-brand-700">Tax</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="mt-6 text-base leading-relaxed text-black"
          >
            The firm assists with registration, ongoing compliance, reconciliation and
            advisory under the Central and State Goods and Services Tax Acts, 2017.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={3}
            className="mt-4 text-base leading-relaxed text-black"
          >
            Support covers new and existing registrations, periodic and annual returns,
            reconciliation of outward supplies and input tax credit, and representation in
            notices and departmental proceedings.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[70%]"
          >
            {highlights.map((highlight, i) => (
              <motion.li
                key={highlight}
                variants={fadeUp}
                custom={4 + i}
                className="flex items-center gap-3"
              >
                <FiCheckCircle className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="text-sm font-medium text-black">{highlight}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
};
