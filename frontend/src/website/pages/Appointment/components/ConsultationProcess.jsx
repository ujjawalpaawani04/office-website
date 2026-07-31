import { motion } from "framer-motion";
import { FiCalendar, FiCheckCircle, FiMessageCircle, FiVideo } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08 * i, ease: EASE } }),
};

const steps = [
  { icon: FiCalendar, title: "Pick a Slot", description: "Choose a date and time that suits your schedule from the live calendar below." },
  { icon: FiMessageCircle, title: "Tell Us the Basics", description: "Share a few details about your requirement so we come prepared." },
  { icon: FiVideo, title: "Meet Your CA", description: "Join the video or phone call at the scheduled time - the link is sent to your email." },
  { icon: FiCheckCircle, title: "Get a Clear Plan", description: "Walk away with concrete next steps, and a follow-up summary by email." },
];

export const ConsultationProcess = () => {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl">
          <motion.span
            variants={fadeUp}
            custom={0}
            className="text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            How It Works
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Four Simple Steps
          </motion.h2>
        </motion.div>

        <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute top-6 left-0 right-0 hidden h-px bg-secondary/10 lg:block" aria-hidden="true" />
          {steps.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg shadow-brand-700/20">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-700">Step {i + 1}</p>
              <p className="mt-1 text-base font-semibold text-black">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-black/65">{description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
