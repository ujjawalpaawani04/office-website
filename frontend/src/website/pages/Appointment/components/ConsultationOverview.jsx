import { motion } from "framer-motion";
import { FiCalendar, FiMonitor, FiClock as FiTimer } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08 * i, ease: EASE } }),
};

const facts = [
  { icon: FiTimer, label: "Duration", value: "30 - 45 Minutes" },
  { icon: FiMonitor, label: "Format", value: "Video Call / Phone" },
  { icon: FiCalendar, label: "Availability", value: "Mon - Sat" },
];

export const ConsultationOverview = () => {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
          >
            Consultation Overview
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            A Focused Session Built Around <span className="text-brand-700">Your Situation</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black/70">
            Every consultation is a one-on-one conversation with a practicing Chartered Accountant - not a sales
            call. Come with your documents, questions, or a specific problem, and leave with a clear, actionable
            plan.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {facts.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={i}
              className="flex items-center gap-4 rounded-xl border border-secondary/10 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-black/50">{label}</p>
                <p className="mt-0.5 text-base font-semibold text-black">{value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
