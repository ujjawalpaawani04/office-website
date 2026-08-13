import { motion } from "framer-motion";
import {
  FiFilePlus,
  FiCalendar,
  FiSliders,
  FiXCircle,
  FiTarget,
  FiCheckCircle,
} from "react-icons/fi";
import { cn } from "../../../../../shared/utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.06 * i, ease: EASE },
  }),
};

const solutions = [
  {
    id: undefined,
    icon: FiFilePlus,
    title: "GST Registration",
    description: "Assessment of registration liability, obtaining new registration, and registration as a casual taxable person where applicable.",
  },
  {
    id: undefined,
    icon: FiCalendar,
    title: "GST Return Filing",
    description: "Preparation and filing of GSTR-1, GSTR-3B, GSTR-4 and other applicable returns, including returns under the QRMP scheme, and payment of tax within the prescribed time.",
  },
  {
    id: undefined,
    icon: FiSliders,
    title: "GST Amendments",
    description: "Amendment of registration particulars as business details change.",
  },
  {
    id: undefined,
    icon: FiXCircle,
    title: "GST Cancellation",
    description: "Cancellation of registration, and revocation of cancellation where applicable.",
  },
  {
    id: "gst-advisory",
    icon: FiTarget,
    title: "GST Advisory",
    description: "Opinions on classification and rate of tax, place of supply, time of supply, valuation, reverse charge liability and the tax treatment of specific transactions.",
  },
  {
    id: undefined,
    icon: FiCheckCircle,
    title: "GST Compliance Support",
    description: "Replies to notices in Form ASMT-10, DRC-01A and DRC-01, and assistance during departmental audit and scrutiny.",
  },
];

export const GSTSolutionsGrid = () => {
  return (
    <section id="gst-registration" className="scroll-mt-28">
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
          GST <span className="text-brand-700">Services</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          Registration, return filing, amendment and cancellation, advisory and departmental
          representation under the GST Acts.
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
                "group rounded-2xl border border-secondary/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg",
                item.id && "scroll-mt-28"
              )}
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
