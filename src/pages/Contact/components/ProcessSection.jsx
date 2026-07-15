import { motion } from "framer-motion";
import { FiEdit3, FiPhoneCall, FiClipboard, FiCheckSquare } from "react-icons/fi";
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

const steps = [
  {
    icon: FiEdit3,
    title: "Submit Your Inquiry",
    description: "Fill out our contact form with your details and the service you need help with.",
  },
  {
    icon: FiPhoneCall,
    title: "Our Experts Contact You",
    description: "A dedicated Chartered Accountant reaches out within one business day to understand your requirement.",
  },
  {
    icon: FiClipboard,
    title: "Financial Assessment & Consultation",
    description: "We review your financials and walk you through the right approach in a detailed consultation.",
  },
  {
    icon: FiCheckSquare,
    title: "Get Tailored CA Solutions",
    description: "Receive a customized plan and ongoing support to keep your finances compliant and on track.",
  },
];

export const ProcessSection = () => {
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
            How We Help You
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            A Simple, Guided Process
          </motion.h2>
        </motion.div>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line - desktop only */}
          <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-secondary/10 lg:block" aria-hidden="true" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="group relative rounded-xl border border-secondary/10 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
              >
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-md shadow-brand-700/20 transition-colors duration-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="mt-4 block text-xs font-semibold uppercase tracking-widest text-brand-700/60">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-base font-semibold text-secondary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary/60">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
