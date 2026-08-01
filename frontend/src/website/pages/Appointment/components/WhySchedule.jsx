import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { FiCheckCircle, FiCalendar, FiLock, FiHeadphones } from "react-icons/fi";

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
    icon: FiCheckCircle,
    title: "Expert Guidance",
    description: "Consult directly with our experienced professionals.",
  },
  {
    icon: FiCalendar,
    title: "Flexible Scheduling",
    description: "Choose a time that fits your convenience.",
  },
  {
    icon: FiLock,
    title: "Confidential & Secure",
    description: "Your information and discussions are always confidential.",
  },
  {
    icon: FiHeadphones,
    title: "Timely Support",
    description: "Get the right solution at the right time.",
  },
];

export const WhySchedule = () => {
  return (
    <section className="bg-brand-50/40 py-14">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
                className="text-center"
              >
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-black">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-black/70">{reason.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
