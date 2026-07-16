import { motion } from "framer-motion";
import { FiAward, FiZap, FiLock, FiUserCheck } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const reasons = [
  {
    icon: FiAward,
    title: "Experienced Chartered Accountants",
    description: "Two decades of hands-on expertise across taxation, audit, and compliance.",
  },
  {
    icon: FiZap,
    title: "Quick Response",
    description: "We respond to every inquiry within one business day, without exception.",
  },
  {
    icon: FiLock,
    title: "Confidential Consultation",
    description: "Your financial information is handled with strict confidentiality at every step.",
  },
  {
    icon: FiUserCheck,
    title: "Trusted Financial Advisors",
    description: "Relied upon by 500+ businesses and individuals for sound financial guidance.",
  },
];

export const WhyContactUs = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Why Contact Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Guidance You Can Rely On
          </motion.h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="group rounded-xl border border-secondary/10 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-black">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
